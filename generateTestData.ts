import { faker } from '@faker-js/faker';
import { Booking, Calendar, BookingGuestMap, BookingPetMap, BookingVehicleMap, Guest, Payment, Pet, Site, Tenant, Unit, UnitType, User, Vehicle } from './types';
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";

// Instantiate Prisma instance

const prisma = new PrismaClient()

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

async function main() {

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
            bcrypt.hash("password", 10).then((hash) => {
                const newUser = {
                    username: "user" + i + "-" + tenant.name,
                    password: hash,
                    tenantId: tenant.id,
                    name: faker.person.firstName() + ' ' + faker.person.lastName(),
                    role: "ADMIN",
                    email: "user" + i + "@" + tenant.name + ".com",
                }
                users.push(newUser)
            })   
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
    const calendarTable: Calendar[] = []
    const dates = generateSequentialDates()
    units.forEach(({id}) => {
        dates.forEach(date => {
            calendarTable.push({
                id: date.toString() + "-" + id.toString(),
                date,
                unitId: id,
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
        const unitsAvailableDates = calendarTable.filter(entry => entry.unitId === randomUnitId && !entry.bookingId)
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

    // WRITE TO DB
    const types = [vehicles, pets, bookings, bookingGuestMap, bookingVehicleMap, bookingPetMap, payments]
    for await (let tenant of tenants) {
        await prisma.tenant.create({
            data: tenant,
        })
    }
    for await (let site of sites) {
        await prisma.site.create({
            data: site,
        })
    }
    for await (let user of users) {
        await prisma.user.create({
            data: user,
        })
    }
    for await (let unitType of unitTypes) {
        await prisma.unitType.create({
            data: unitType,
        })
    }
    for await (let unit of units) {
        await prisma.unit.create({
            data: unit,
        })
    }
    for await (let guest of guests) {
        await prisma.guest.create({
            data: guest,
        })
    }
    for await (let vehicle of vehicles) {
        await prisma.vehicle.create({
            data: vehicle,
        })
    }
    for await (let pet of pets) {
        await prisma.pet.create({
            data: pet,
        })
    }
    for await (let booking of bookings) {
        await prisma.booking.create({
            data: booking,
        })
    }
    for await (let calendarEntry of calendarTable) {
        await prisma.calendar.create({
            data: calendarEntry,
        })
    }
    for await (let bookingGuestMapObj of bookingGuestMap) {
        await prisma.bookingGuestMap.create({
            data: bookingGuestMapObj,
        })
    }
    for await (let bookingPetMapObj of bookingPetMap) {
        await prisma.bookingPetMap.create({
            data: bookingPetMapObj,
        })
    }
    for await (let bookingVehicleMapObj of bookingVehicleMap) {
        await prisma.bookingVehicleMap.create({
            data: bookingVehicleMapObj,
        })
    }
    for await (let payment of payments) {
        await prisma.payment.create({
            data: payment,
        })
    }
    console.log("Woohoo!  Test data has been generated.  Have at it!")
}

main().then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });