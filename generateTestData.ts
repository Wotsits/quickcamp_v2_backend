import { faker } from '@faker-js/faker';
import { Booking, BookingGuest, BookingPet, BookingVehicle, Calendar, LeadGuest, Payment, PrismaClient, Role, Site, Tenant, Unit, UnitType, User } from '@prisma/client'
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

  function generateRandomUKRegistrationNumber() {
    // Define an array of all possible letters for UK registration numbers
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    // Generate random letters for the registration number
    const randomLetters = `${letters.charAt(
      Math.floor(Math.random() * letters.length)
    )}${letters.charAt(Math.floor(Math.random() * letters.length))}`;
  
    // Generate random numbers for the registration number (between 10 and 99)
    const randomNumbers = Math.floor(Math.random() * 90) + 10;
  
    // Generate random letters for the last part of the registration number
    const randomLetters2 = `${letters.charAt(
      Math.floor(Math.random() * letters.length)
    )}${letters.charAt(Math.floor(Math.random() * letters.length))}${letters.charAt(
      Math.floor(Math.random() * letters.length)
    )}`;
  
    // Combine the parts to form the registration number
    const registrationNumber = `${randomLetters}${randomNumbers} ${randomLetters2}`;
  
    return registrationNumber;
  }

// --------------
// Main
// --------------

async function main() {

    // settings 
    const tenantNo = 1;
    const siteNo = 2;
    const bookingNo = 300;

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
    let userId = 1;
    for await (let tenant of tenants){
        for (let i = 0; i < siteNo; i++) {
            const hash = await bcrypt.hash("password", 10)
            const newUser = {
                id: userId,
                username: "user" + i + "-" + tenant.name,
                password: hash,
                tenantId: tenant.id,
                name: faker.person.firstName() + ' ' + faker.person.lastName(),
                email: "user" + i + "@" + tenant.name + ".com",
            }
            users.push(newUser)
            userId++
        }
    }

    // build Roles
    const roles: Role[] = [];
    users.forEach(user => {
        roles.push({
            id: user.id,
            role: "ADMIN",
            userId: user.id
        })
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
                bookingId: null
            })
        })
    })

    // build guests
    const guests: LeadGuest[] = [];
    for (let i = 0; i < bookingNo; i++) {
        const hash = await bcrypt.hash("password", 10)
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
            password: hash,
            tenantId: 0
        }
        guests.push(newGuest)
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

    // build BookingGuests, 
    const bookingGuests: BookingGuest[] = []
    let bookingId = 1;
    bookings.forEach((booking, bookingIndex) => {
        const randomGuestNo = Math.ceil(Math.random()*6)
        for (let i = 0; i < randomGuestNo; i++) {
            const newMap = {
                id: bookingId,
                bookingId: booking.id,
                guestName: faker.person.firstName() + " " + faker.person.lastName(),
                age: Math.floor(Math.random()*100),
                start: booking.start,
                end: booking.end,
                checkedIn: false
            }
            bookingGuests.push(newMap)
            bookingId++
        }
    })

    // build BookingVehicles, 
    const bookingVehicles: BookingVehicle[] = []
    let vehicleId = 1;
    bookings.forEach((booking) => {
        const randomVehicleNo = Math.ceil(Math.random()*2)
        for (let i = 0; i < randomVehicleNo; i++) { 
            const newMap = {
                id: vehicleId,
                bookingId: booking.id,
                vehicleReg: generateRandomUKRegistrationNumber(),
                start: booking.start,
                end: booking.end,
                checkedIn: false
            }
            bookingVehicles.push(newMap)
            vehicleId++
        }
    })

    // build BookingPetMaps, 
    const bookingPets: BookingPet[] = []
    let petId = 1;
    bookings.forEach((booking) => {
        const randomPetNo = Math.ceil(Math.random()*2)
        for (let i = 0; i < randomPetNo; i++) {
            const newMap = {
                id: petId,
                bookingId: booking.id,
                petName: faker.person.firstName(),
                start: booking.start,
                end: booking.end,
                checkedIn: false
            }
            bookingPets.push(newMap)
            petId++
        }
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
        await prisma.leadGuest.create({
            data: guest,
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
    for await (let bookingGuestObj of bookingGuests) {
        await prisma.bookingGuest.create({
            data: bookingGuestObj,
        })
    }
    for await (let bookingPetObj of bookingPets) {
        await prisma.bookingPet.create({
            data: bookingPetObj,
        })
    }
    for await (let bookingVehicleObj of bookingVehicles) {
        await prisma.bookingVehicle.create({
            data: bookingVehicleObj,
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