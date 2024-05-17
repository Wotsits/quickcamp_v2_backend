import { faker } from "@faker-js/faker";
import {
  Booking,
  BookingGuest,
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
  GuestTypeGroup,
  GuestType,
  EquipmentType,
  ExtraType,
  GuestFeesCalendar,
  ExtraFeesCalendar,
  UnitTypeFeesCalendar,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateRandomTime, generateRandomUKRegistrationNumber, generateSequentialDates, readCsvFileToJson, readUsersCSVFileToJson } from "./helpers/helpers.js";

// Instantiate Prisma instance

const prisma = new PrismaClient();

// --------------
// Main
// --------------

async function main() {
  // settings
  const bookingNo = 1000;

  // built stock data

  const tenants: Tenant[] = (await readCsvFileToJson(
    "./mockData/data/tenants.csv",
    "Tenants Built"
  )) as Tenant[];

  const sites: Site[] = (await readCsvFileToJson(
    "./mockData/data/sites.csv",
    "Sites Built"
  )) as Site[];

  const users: User[] = (await readUsersCSVFileToJson(
    "./mockData/data/users.csv",
    "Users Built"
  )) as User[];

  const roles = (await readCsvFileToJson(
    "./mockData/data/roles.csv",
    "Roles Built"
  )) as Role[];

  const unitTypes = (await readCsvFileToJson(
    "./mockData/data/unitTypes.csv",
    "Unit Types Built"
  )) as UnitType[];

  const units: Unit[] = (await readCsvFileToJson(
    "./mockData/data/units.csv",
    "Units Built"
  )) as Unit[];

  const guestTypesGroups: GuestTypeGroup[] = (await readCsvFileToJson(
    "./mockData/data/guestTypeGroups.csv",
    "Guest Type Groups Built"
  )) as GuestTypeGroup[];

  const guestTypes: GuestType[] = (await readCsvFileToJson(
    "./mockData/data/guestTypes.csv",
    "Guest Types Built"
  )) as GuestType[];

  const equipmentTypes: EquipmentType[] = (await readCsvFileToJson(
    "./mockData/data/equipmentTypes.csv",
    "Equipment Types Built"
  )) as EquipmentType[];

  const extraTypes: ExtraType[] = (await readCsvFileToJson(
    "./mockData/data/extraTypes.csv",
    "Extra Types Built"
  )) as ExtraType[];

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
  const unitTypeFeesCalendar: UnitTypeFeesCalendar[] = [];
  const guestTypeFeesCalendar: GuestFeesCalendar[] = [];
  const extraFeesCalendar: ExtraFeesCalendar[] = [];

  let counter = 1;
  dates.forEach((date) => {
    unitTypes.forEach((unitType) => {
      unitTypeFeesCalendar.push({
        id: counter,
        date,
        unitTypeId: unitType.id,
        feePerNight: 10,
        feePerStay: 0,
      });
      counter++;
    });
  });

  counter = 1;

  dates.forEach((date) => {
    sites.forEach(site => {
      
      const unitTypesForSite = unitTypes.filter(unitType => unitType.siteId === site.id);
      const guestTypeGroupsForSite = guestTypesGroups.filter(guestTypeGroup => guestTypeGroup.siteId === site.id);
      
      guestTypeGroupsForSite.forEach((guestTypeGroup) => {
        const guestTypesForGroup = guestTypes.filter(guestType => guestType.guestTypeGroupId === guestTypeGroup.id);
        
        guestTypesForGroup.forEach((guestType) => {
          unitTypesForSite.forEach((unitType) => {
            guestTypeFeesCalendar.push({
              id: counter,
              date,
              guestTypeId: guestType.id,
              unitTypeId: unitType.id,
              feePerNight: 10,
              feePerStay: 0,
            });
            counter++;
          });
        });
      })
    })
  });

  counter = 1;

  dates.forEach((date) => {
    unitTypes.forEach((unitType) => {
      extraTypes.forEach((extraType) => {
        extraFeesCalendar.push({
          id: counter,
          date,
          extraTypeId: extraType.id,
          unitTypeId: unitType.id,
          feePerNight: 5,
          feePerStay: 0,
        });
        counter++;
      });
    });
  });

  console.log("Fee calendars built");

  // build Bookings,
  const bookings: Booking[] = [];
  let successfulBookingCount = 0;
  while (successfulBookingCount < bookingNo) {
    const unitTypesForSite = unitTypes.filter(unitType => unitType.siteId === 1);
    const unitsForSite: Unit[]= [];
    unitTypesForSite.forEach(unitType => {
      const unitsForType = units.filter(unit => unit.unitTypeId === unitType.id);
      unitsForSite.push(...unitsForType);
    })

    // make bookings
    const randomGuestId = Math.ceil(Math.random() * leadGuests.length);
    const randomUnitIndex = Math.floor(Math.random() * unitsForSite.length);
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
      status: "CONFIRMED",
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
    const randomGuestNo = Math.ceil(Math.random() * 8);
    // figure out which site the booking is for
    const unitId = booking.unitId;
    const unitTypeId = units.find((unit) => unit.id === unitId)!.unitTypeId;
    const siteId = unitTypes.find((unitType) => unitType.id === unitTypeId)!.siteId;
    const guestTypesGroupsForSite = guestTypesGroups.filter(guestTypeGroup => guestTypeGroup.siteId === siteId);
    const guestTypesForSite: GuestType[] = [];
    guestTypesGroupsForSite.forEach(guestTypeGroup => {
      const guestTypesForGroup = guestTypes.filter(guestType => guestType.guestTypeGroupId === guestTypeGroup.id);
      guestTypesForSite.push(...guestTypesForGroup);
    })
    for (let i = 1; i <= randomGuestNo; i++) {
      // generate a random guest type
      const randomGuestTypeIndex = Math.floor(Math.random() * (guestTypesForSite.length));
      const guestType = guestTypesForSite[randomGuestTypeIndex];
      const guestTypeGroup = guestTypesGroupsForSite.find(guestTypeGroup => guestTypeGroup.id === guestType.guestTypeGroupId)!;
      let name = "";
      let arrivalTime: string | null = null;
      if (guestTypeGroup.getAndReportArrivalTime) {
        arrivalTime = generateRandomTime();
      }
      if (guestTypeGroup.name === "People" || guestTypeGroup.name === "Wedding Guests") {
        name = faker.person.firstName() + " " + faker.person.lastName();
      }
      else if (guestTypeGroup.name === "Pets") {
        name = faker.person.firstName();
      }
      else if (guestTypeGroup.name === "Vehicles") {
        name = generateRandomUKRegistrationNumber();
      }
      const newMap = {
        id: bookingId,
        bookingId: booking.id,
        name: name,
        guestTypeId: guestType.id,
        start: booking.start,
        end: booking.end,
        checkedIn: null,
        checkedOut: null,
        arrivalTime: arrivalTime
      };
      bookingGuests.push(newMap);
      bookingId++;
    }
  });

  console.log("Booking Guests built");

  // build Payments
  const payments: Payment[] = [];
  bookings.forEach((booking, index) => {
    const availablePaymentMethods = ["CASH", "CARD", "BANK TRANSFER"]
    const randomIndex = Math.floor(Math.random() * availablePaymentMethods.length)
    const paymentMethod = availablePaymentMethods[randomIndex]
    payments.push({
      id: index,
      paymentDate: new Date(),
      bookingId: booking.id,
      paymentAmount: 100,
      paymentMethod: paymentMethod,
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
  for await (let unitTypeFee of unitTypeFeesCalendar) {
    await prisma.unitTypeFeesCalendar.create({
      data: unitTypeFee,
    });
  }
  console.log("Unit Type Fees created");
  for await (let guestTypeGroup of guestTypesGroups) {
    await prisma.guestTypeGroup.create({
      data: guestTypeGroup,
    });
  }
  console.log("Guest Type Groups created");
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
  for await (let fees of guestTypeFeesCalendar) {
    await prisma.guestFeesCalendar.create({
      data: fees,
    });
  }
  console.log("Guest Fees created");
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
  for await (let payment of payments) {
    await prisma.payment.create({
      data: payment,
    });
  }
  console.log("Payments created")
  console.log('\u0007') // system bell noise
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



