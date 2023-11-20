import { faker } from "@faker-js/faker";
import {
  Booking,
  BookingGuest,
  BookingPet,
  BookingVehicle,
  Calendar,
  LeadGuest,
  Payment,
  PrismaClient,
  Role,
  Site,
  Tenant,
  Unit,
  UnitType,
  User,
  GuestType,
  EquipmentType,
  ExtraType,
  GuestFeesCalendar,
  PetFeesCalendar,
  VehicleFeesCalendar,
  ExtraFeesCalendar,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import fs, { read } from "fs";
import csvParser from "csv-parser";

// Instantiate Prisma instance

const prisma = new PrismaClient();

// -------------
// HELPERS
// -------------

function generateSequentialDates(): Date[] {
  const currentDate = new Date();
  currentDate.setHours(12, 0, 0, 0); // Set time to 12:00:00

  const dates = [];

  for (let i = -365; i <= 365 * 5; i++) {
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
  )}${letters.charAt(
    Math.floor(Math.random() * letters.length)
  )}${letters.charAt(Math.floor(Math.random() * letters.length))}`;

  // Combine the parts to form the registration number
  const registrationNumber = `${randomLetters}${randomNumbers} ${randomLetters2}`;

  return registrationNumber;
}

async function readCsvFileToJson(fileName: string, notification: string) {
  return new Promise((resolve, reject) => {
    const arr: any[] = [];
    fs.createReadStream(fileName)
      .pipe(csvParser())
      .on("data", async (data) => {
        arr.push(await {
          ...data,
          id: parseInt(data.id),
          tenantId: data.tenantId && parseInt(data.tenantId),
          userId: data.userId && parseInt(data.userId),
          siteId: data.siteId && parseInt(data.siteId),
          unitTypeId: data.unitTypeId && parseInt(data.unitTypeId),

        });
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", () => {
        console.log(notification);
        resolve(arr);
      });
  });
}

async function readUsersCSVFileToJson(fileName: string, notification: string) {
  return new Promise((resolve, reject) => {
    const arr: any[] = [];
    fs.createReadStream(fileName)
      .pipe(csvParser())
      .on("data", async (data) => {
        const hash = await bcrypt.hash(data.password, 10);
        const newUser = {
          id: parseInt(data.id),
          username: data.username,
          password: hash,
          tenantId: parseInt(data.tenantId),
          name: data.name,
          email: data.email,
        };
        arr.push(newUser);
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", () => {
        console.log(notification);
        resolve(arr);
      });
    return arr;
  });
}

// --------------
// Main
// --------------

async function main() {
  // settings
  const bookingNo = 300;

  // built stock data

  const tenants: Tenant[] = await readCsvFileToJson(
    "./mockData/tenants.csv",
    "Tenants Built"
  ) as Tenant[];

  const sites: Site[] = await readCsvFileToJson(
    "./mockData/sites.csv",
    "Sites Built"
  ) as Site[];

  const users: User[] = await readUsersCSVFileToJson(
    "./mockData/users.csv",
    "Users Built"
  ) as User[];

  const roles = await readCsvFileToJson("./mockData/roles.csv", "Roles Built") as Role[];

  const unitTypes = await readCsvFileToJson(
    "./mockData/unitTypes.csv",
    "Unit Types Built"
  ) as UnitType[];

  const units: Unit[] = await readCsvFileToJson(
    "./mockData/units.csv",
    "Units Built"
  ) as Unit[];

  const guestTypes: GuestType[] = await readCsvFileToJson(
    "./mockData/guestTypes.csv",
    "Guest Types Built"
  ) as GuestType[];

  const equipmentTypes: EquipmentType[] = await readCsvFileToJson(
    "./mockData/equipmentTypes.csv",
    "Equipment Types Built"
  ) as EquipmentType[];

  const extraTypes: ExtraType[] = await readCsvFileToJson(
    "./mockData/extraTypes.csv",
    "Extra Types Built"
  ) as ExtraType[];

  // build calendarTable
  const calendarTable: Calendar[] = [];
  const dates = generateSequentialDates();
  units.forEach(({ id }) => {
    dates.forEach((date) => {
      calendarTable.push({
        id: date.toString() + "-" + id.toString(),
        date,
        unitId: id,
        bookingId: null,
      });
    });
  });

  console.log("Calendar built");

  // build guests
  const leadGuests: LeadGuest[] = [];
  for (let i = 1; i <= bookingNo; i++) {
    const hash = await bcrypt.hash("password", 10);
    const newGuest = {
      id: i,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      address1: faker.location.streetAddress(),
      address2: "",
      townCity: faker.location.city(),
      county: faker.location.county(),
      postcode: faker.location.zipCode(),
      country: faker.location.country(),
      tel: faker.phone.number(),
      email: faker.internet.email(),
      password: hash,
      tenantId: 1,
    };
    leadGuests.push(newGuest);
  }

  console.log("Lead Guests built");

  //build fees
  const feesCalendar: GuestFeesCalendar[] = [];
  const petFeesCalendar: PetFeesCalendar[] = [];
  const vehicleFeesCalendar: VehicleFeesCalendar[] = [];
  const extraFeesCalendar: ExtraFeesCalendar[] = [];

  let counter = 1;

  dates.forEach((date) => {
    guestTypes.forEach((guestType) => {
      feesCalendar.push({
        id: counter,
        date,
        guestTypeId: guestType.id,
        feePerNight: 10,
        feePerStay: 0,
      });
      counter++;
    });
  });

  counter = 1;

  dates.forEach((date) => {
    petFeesCalendar.push({
      id: counter,
      date,
      feePerNight: 5,
      feePerStay: 0,
    });
    counter++;
  });

  counter = 1;

  dates.forEach((date) => {
    vehicleFeesCalendar.push({
      id: counter,
      date,
      feePerNight: 5,
      feePerStay: 0,
    });
    counter++;
  });

  console.log("Fee calendars built");

  // build Bookings,
  const bookings: Booking[] = [];
  let successfulBookingCount = 0;
  while (successfulBookingCount < bookingNo) {
    // make bookings
    const randomGuestId = Math.ceil(Math.random() * leadGuests.length);
    const randomUnitIndex = Math.floor(Math.random() * units.length);
    const randomUnitId = units[randomUnitIndex].id;
    const unitsAvailableDates = calendarTable.filter(
      (entry) => entry.unitId === randomUnitId && !entry.bookingId
    );
    const randomAvailableIndex = Math.floor(
      Math.random() * unitsAvailableDates.length
    );
    const randomAvailableDate = unitsAvailableDates[randomAvailableIndex];

    // generate the new booking
    const newBookingId = successfulBookingCount + 1;
    const startDate: Date = new Date(randomAvailableDate.date);
    let endDate: Date = new Date(startDate);
    endDate = new Date(endDate.setDate(endDate.getDate() + 1));
    const newBooking = {
      id: newBookingId,
      start: startDate,
      end: endDate,
      unitId: randomUnitId,
      totalFee: 100,
      leadGuestId: randomGuestId,
    };

    bookings.push(newBooking);
    randomAvailableDate.bookingId = newBookingId;
    successfulBookingCount++;
  }

  console.log("Bookings built");

  // build BookingGuests,
  const bookingGuests: BookingGuest[] = [];
  let bookingId = 1;
  bookings.forEach((booking, bookingIndex) => {
    const randomGuestNo = Math.ceil(Math.random() * 6);
    const guestType = Math.ceil(Math.random() * 4);
    for (let i = 1; i <= randomGuestNo; i++) {
      const newMap = {
        id: bookingId,
        bookingId: booking.id,
        name: faker.person.firstName() + " " + faker.person.lastName(),
        guestTypeId: guestTypes[guestType].id,
        start: booking.start,
        end: booking.end,
        checkedIn: null,
      };
      bookingGuests.push(newMap);
      bookingId++;
    }
  });

  console.log("Booking Guests built");

  // build BookingVehicles,
  const bookingVehicles: BookingVehicle[] = [];
  let vehicleId = 1;
  bookings.forEach((booking) => {
    const randomVehicleNo = Math.ceil(Math.random() * 2);
    for (let i = 1; i <= randomVehicleNo; i++) {
      const newMap = {
        id: vehicleId,
        bookingId: booking.id,
        vehicleReg: generateRandomUKRegistrationNumber(),
        start: booking.start,
        end: booking.end,
        checkedIn: null,
      };
      bookingVehicles.push(newMap);
      vehicleId++;
    }
  });

  console.log("Booking Vehicles built");

  // build BookingPetMaps,
  const bookingPets: BookingPet[] = [];
  let petId = 1;
  bookings.forEach((booking) => {
    const randomPetNo = Math.ceil(Math.random() * 2);
    for (let i = 1; i <= randomPetNo; i++) {
      const newMap = {
        id: petId,
        bookingId: booking.id,
        name: faker.person.firstName(),
        start: booking.start,
        end: booking.end,
        checkedIn: null,
      };
      bookingPets.push(newMap);
      petId++;
    }
  });

  console.log("Booking Pets built");

  // build Payments
  const payments: Payment[] = [];
  bookings.forEach((booking, index) => {
    payments.push({
      id: index,
      paymentDate: new Date(),
      bookingId: booking.id,
      paymentAmount: 100,
      paymentMethod: "CASH",
    });
  });

  console.log("Payments built");

  // WRITE TO DB
  for await (let tenant of tenants) {
    await prisma.tenant.create({
      data: tenant,
    });
  }
  console.log("Tenants created");
  for await (let site of sites) {
    await prisma.site.create({
      data: site,
    });
  }
  console.log("Sites created");
  for await (let user of users) {
    await prisma.user.create({
      data: user,
    });
  }
  console.log("Users created");
  for await (let role of roles) {
    await prisma.role.create({
      data: role,
    });
  }
  console.log("Roles created");
  for await (let equipmentType of equipmentTypes) {
    await prisma.equipmentType.create({
      data: equipmentType,
    });
  }
  console.log("Equipment Types created");
  for await (let unitType of unitTypes) {
    const connectArr: { id: number }[] = equipmentTypes.map((equipmentType) => {
      return { id: equipmentType.id };
    });
    await prisma.unitType.create({
      data: { ...unitType, equipmentTypes: { connect: connectArr } },
    });
  }
  console.log("Unit Types created");
  for await (let unit of units) {
    await prisma.unit.create({
      data: unit,
    });
  }
  console.log("Units created");
  for await (let leadGuest of leadGuests) {
    await prisma.leadGuest.create({
      data: leadGuest,
    });
  }
  console.log("Lead Guests created");
  for await (let guestType of guestTypes) {
    await prisma.guestType.create({
      data: guestType,
    });
  }
  console.log("Guest Types created");
  for await (let extraType of extraTypes) {
    const connectArr = unitTypes.map((unityType) => {
      return { id: unityType.id };
    });
    await prisma.extraType.create({
      data: { ...extraType, unitTypes: { connect: connectArr } },
    });
  }
  console.log("Extra Types created");
  for await (let fees of feesCalendar) {
    await prisma.guestFeesCalendar.create({
      data: fees,
    });
  }
  console.log("Guest Fees created");
  for await (let fees of petFeesCalendar) {
    await prisma.petFeesCalendar.create({
      data: fees,
    });
  }
  console.log("Pet Fees created");
  for await (let fees of vehicleFeesCalendar) {
    await prisma.vehicleFeesCalendar.create({
      data: fees,
    });
  }
  console.log("Vehicle Fees created");
  for await (let fees of extraFeesCalendar) {
    await prisma.extraFeesCalendar.create({
      data: fees,
    });
  }
  console.log("Extra Fees created");
  for await (let booking of bookings) {
    await prisma.booking.create({
      data: booking,
    });
  }
  console.log("Bookings created");
  for await (let calendarEntry of calendarTable) {
    await prisma.calendar.create({
      data: calendarEntry,
    });
  }
  console.log("Calendar created");
  for await (let bookingGuestObj of bookingGuests) {
    await prisma.bookingGuest.create({
      data: bookingGuestObj,
    });
  }
  console.log("Booking Guests created");
  for await (let bookingPetObj of bookingPets) {
    await prisma.bookingPet.create({
      data: bookingPetObj,
    });
  }
  console.log("Booking Pets created");
  for await (let bookingVehicleObj of bookingVehicles) {
    await prisma.bookingVehicle.create({
      data: bookingVehicleObj,
    });
  }
  console.log("Booking Vehicles created");
  for await (let payment of payments) {
    await prisma.payment.create({
      data: payment,
    });
  }
  console.log("Payments created");
  console.log("Woohoo!  Test data has been generated.  Have at it!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
