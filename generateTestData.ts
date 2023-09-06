import { faker } from '@faker-js/faker';
import { Booking, BookingGuestMap, BookingPetMap, BookingVehicleMap, Guest, Payment, Pet, Site, Tenant, Unit, UnitType, User, Vehicle } from './types';
import FileSystem from "fs";

// -------------
// HELPERS
// -------------

function generateSequentialDates(): Date[] {
    const currentDate = new Date();
    currentDate.setHours(12, 0, 0, 0); // Set time to 12:00:00
  
    const dates = [];
  
    for (let i = -365; i <= 365*5; i++) {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + i);
      dates.push(newDate);
    }
  
    return dates;
  }

// --------------
// Main
// --------------

function main() {

    // settings 
    const tenantNo = 1;
    const siteNo = 2;

    const guestNo = 100;
    const petNo = 10;
    const vehicleNo = 30;
    const bookingNo = 20;

    // build tenants
    const tenants: Tenant[] = [];
    for (let i = 0; i < tenantNo; i++) {
        const newTenant = {
            id: i,
            name: "Org" + i
        }
        tenants.push(newTenant)
    }

    // build Sites 
    const sites: Site[] = [];
    tenants.forEach(tenant => {
        for (let i = 0; i < siteNo; i++) {
            const newSite = {
                id: i,
                name: faker.lorem.word() + " Campsite",
                tenantId: tenant.id
            }
            sites.push(newSite)
        }
    })
    
    // build Users,
    const users: User[] = [];
    tenants.forEach(tenant => {
        for (let i = 0; i < siteNo; i++) {
            const newUser = {
                email: "user" + i + "@" + tenant.name + ".com",
                password: "password",
                tenantId: tenant.id
            }
            users.push(newUser)
        }
    })

    // build UnitTypes, 
    const unitTypes: UnitType[] = [];
    sites.forEach((site, index) => {
        unitTypes.push(
            {
                id: parseInt(site.id.toString()+index.toString()+"1"),
                name: "Bronze",
                siteId: site.id
            },
        )
        unitTypes.push(
            {
                id: parseInt(site.id.toString()+index.toString()+"2"),
                name: "Silver",
                siteId: site.id
            },
        )
        unitTypes.push(
            {
                id: parseInt(site.id.toString()+index.toString()+"3"),
                name: "Gold",
                siteId: site.id
            },
        )
    })

    // build Units, 
    const units: Unit[] = [];
    unitTypes.forEach((unitType, index) => {
        units.push({
            id: parseInt(unitType.id+"1"),
            name: unitType.name + "" + index.toString(),
            unitTypeId: unitType.id
        })
    })

    // build calendarTable
    const calendarTable: {date: Date, unitId: number, bookingId: number | null}[] = []
    const dates = generateSequentialDates()
    units.forEach(({id}) => {
        dates.forEach(date => {
            calendarTable.push({
                date,
                unitId: id,
                bookingId: null
            })
        })
    })

    // build guests
    const guests: Guest[] = [];
    for (let i = 0; i < guestNo; i++) {
        const newGuest = {
            id: i,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            address1: faker.location.streetAddress(),
            address2: "",
            townCity: faker.location.city(),
            postcode: faker.location.zipCode(),
            tel: faker.phone.number(),
            email: faker.internet.email(),
            password: "Password"
        }
        guests.push(newGuest)
    }
    
    // build Vehicles, 
    
    const vehicles: Vehicle[] = [];
    for (let i = 0; i < vehicleNo; i++) {
        const newVehicle = {
            id: i,
            vehReg: "AB" + (50+i).toString() + " AAA"
        }
        vehicles.push(newVehicle)
    }

    // build Pets, 
    const pets: Pet[] = [];
    for (let i = 0; i < petNo; i++) {
        const newPet = {
            id: i,
            name: faker.person.firstName()
        }
        pets.push(newPet)
    }

    // build Bookings, 
    const bookings: Booking[] = [];    
    let successfulBookingCount = 0;
    while (successfulBookingCount < bookingNo) {
        // make bookings
        const randomGuestId = Math.floor(Math.random()*guests.length)
        const randomUnitIndex = Math.floor(Math.random()*units.length)
        const randomUnitId = units[randomUnitIndex].id
        const unitsAvailableDates = calendarTable.filter(entry => entry.unitId === randomUnitId && entry.bookingId === null)
        const randomAvailableIndex = Math.floor(Math.random() * unitsAvailableDates.length)
        const randomAvailableDate = unitsAvailableDates[randomAvailableIndex]

        // generate the new booking
        const newBookingId = successfulBookingCount + 1;
        const startDate: Date = new Date(randomAvailableDate.date)
        let endDate: Date = new Date(startDate)
        endDate = new Date(endDate.setDate(endDate.getDate() + 1))
        const newBooking = {
            id: newBookingId,
            start: startDate,
            end: endDate,
            unitId: randomUnitId,
            totalFee: 100,
            leadGuestId: randomGuestId
        }

        bookings.push(newBooking)
        randomAvailableDate.bookingId = newBookingId;
        successfulBookingCount++
    }

    // build BookingGuestMaps, 
    const bookingGuestMap: BookingGuestMap[] = []
    bookings.forEach((booking, bookingIndex) => {
        const randomGuestNo = Math.ceil(Math.random()*6)
        const guestsToAssignToBooking: number[] = [];
        for (let i = 0; i < randomGuestNo; i++) {
            const targetGuestIndex = Math.floor(Math.random()*guests.length)
            const targetGuestId = guests[targetGuestIndex].id;
            guestsToAssignToBooking.push(targetGuestId)
        }
        guestsToAssignToBooking.forEach((guestId, guestIndex) => {
            const newMap = {
                id: parseInt(bookingIndex.toString() + guestIndex.toString()),
                bookingId: booking.id,
                guestId: guestId,
                start: booking.start,
                end: booking.end
            }
            bookingGuestMap.push(newMap)
        })
    })

    // build BookingVehicleMaps, 
    const bookingVehicleMap: BookingVehicleMap[] = []
    bookings.forEach((booking, bookingIndex) => {
        const randomVehicleNo = Math.ceil(Math.random()*2)
        const vehiclesToAssignToBooking: number[] = [];
        for (let i = 0; i < randomVehicleNo; i++) {
            const targetVehicleIndex = Math.floor(Math.random()*vehicles.length)
            const targetVehicleId = guests[targetVehicleIndex].id;
            vehiclesToAssignToBooking.push(targetVehicleId)
        }
        vehiclesToAssignToBooking.forEach((vehicleId, vehicleIndex) => {
            const newMap = {
                id: parseInt(bookingIndex.toString() + vehicleIndex.toString()),
                bookingId: booking.id,
                vehicleId: vehicleId,
                start: booking.start,
                end: booking.end
            }
            bookingVehicleMap.push(newMap)
        })
    })

    // build BookingPetMaps, 
    const bookingPetMap: BookingPetMap[] = []
    bookings.forEach((booking, bookingIndex) => {
        const randomPetNo = Math.ceil(Math.random()*2)
        const petsToAssignToBooking: number[] = [];
        for (let i = 0; i < randomPetNo; i++) {
            const targetPetIndex = Math.floor(Math.random()*pets.length)
            const targetPetId = guests[targetPetIndex].id;
            petsToAssignToBooking.push(targetPetId)
        }
        petsToAssignToBooking.forEach((petId, petIndex) => {
            const newMap = {
                id: parseInt(bookingIndex.toString() + petIndex.toString()),
                bookingId: booking.id,
                petId: petId,
                start: booking.start,
                end: booking.end
            }
            bookingPetMap.push(newMap)
        })
    })

    // build Payments 
    const payments: Payment[] = [];
    bookings.forEach((booking, index) => {
        payments.push({
            id: index,
            createdAt: new Date(),
            bookingId: booking.id,
            amount: 100
        })
    })

    // WRITE TO FILE
    const fileNames = ["tblTenants", "tblSites", "tblUsers", "tblUnitTypes", "tblUnits", "tblCalendarTable", "tblGuests", "tblVehicles", "tblPets", "tblBookings", "tblBookingGuestMap", "tblBookingVehicleMap", "tblBookingPetMap", "tblPayments"]
    const files = [tenants, sites, users, unitTypes, units, calendarTable, guests, vehicles, pets, bookings, bookingGuestMap, bookingVehicleMap, bookingPetMap, payments]
    fileNames.forEach((fileName, index) => {
        FileSystem.writeFile(`data/${fileName}.json`, JSON.stringify(files[index]), (error) => {
            if (error) throw error;
        });
    })    
 
}

main();