import {
  ExtraFeesCalendar,
  GuestFeesCalendar,
  Payment,
  PrismaClient,
  UnitTypeFeesCalendar,
} from "@prisma/client";
import {
  BookingProcessGuest,
  BookingProcessPet,
  BookingProcessVehicle,
} from "../../types";

export const bookingPaymentsTotal = (payments: Payment[]) => {
  // total the payments
  let total = 0;
  payments.forEach((payment) => {
    total += payment.paymentAmount;
  });
  return total;
};

export async function calculateFee(
  unitTypeId: number,
  startDate: Date,
  endDate: Date,
  extras: number[],
  bookingGuests: BookingProcessGuest[],
  prisma: PrismaClient
) {
  const guestTypes: number[] = [];
  bookingGuests.forEach((guest: BookingProcessGuest) => {
    const guestTypeId = parseInt(guest.guestTypeId);
    if (!guestTypes.includes(guestTypeId)) {
      guestTypes.push(guestTypeId);
    }
  });

  // get the rates for the unit type
  const ratesForUnitType = await prisma.unitTypeFeesCalendar.findMany({
    where: {
      unitTypeId: unitTypeId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  // get the rates for the guests
  const ratesForGuests = await prisma.guestFeesCalendar.findMany({
    where: {
      guestTypeId: {
        in: guestTypes,
      },
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  // get the rates for the extras
  const ratesForExtras = await prisma.extraFeesCalendar.findMany({
    where: {
      extraTypeId: {
        in: extras,
      },
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
  });

  // ---------------
  // CALCULATE RATES

  // produce an array of the dates in the range
  const nights = [];
  const currentDate = startDate;
  while (currentDate < endDate) {
    nights.push(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  let total = 0;

  // get a count of the number of guests of each type
  const guestTypeCounts: { [key: number]: number } = {};
  bookingGuests.forEach((guest: BookingProcessGuest) => {
    const guestTypeId = parseInt(guest.guestTypeId);
    if (guestTypeCounts[guestTypeId]) {
      guestTypeCounts[guestTypeId] += 1;
    } else {
      guestTypeCounts[guestTypeId] = 1;
    }
  });

  let rateForUnitType: UnitTypeFeesCalendar | undefined;
  let rateForGuests: GuestFeesCalendar[];
  let rateForExtras: ExtraFeesCalendar[];

  // for each date, calculate the rate
  nights.forEach((date: Date) => {
    // get the rate for the unit type
    rateForUnitType = ratesForUnitType.find(
      (rate: UnitTypeFeesCalendar) => rate.date.getTime() === date.getTime()
    );

    // get the rate for the guests
    rateForGuests = ratesForGuests.filter(
      (rate: GuestFeesCalendar) => rate.date.getTime() === date.getTime()
    );

    // get the rate for the extras
    rateForExtras = ratesForExtras.filter(
      (rate: ExtraFeesCalendar) => rate.date.getTime() === date.getTime()
    );

    // calculate the nightly rate for this date
    let rateForDate = 0;
    if (rateForUnitType) rateForDate += rateForUnitType.feePerNight;
    if (rateForGuests) {
      for (const key in guestTypeCounts) {
        const applicableRate = ratesForGuests.find(
          (rate: GuestFeesCalendar) => rate.guestTypeId === parseInt(key)
        );
        if (applicableRate)
          rateForDate += applicableRate.feePerNight * guestTypeCounts[key];
      }
    }
    if (rateForExtras) {
      extras.forEach((extra: number) => {
        const applicableRate = ratesForExtras.find(
          (rate: ExtraFeesCalendar) => rate.extraTypeId === extra
        );
        if (applicableRate) rateForDate += applicableRate.feePerNight;
      });
    }

    // add the rate to the total
    total += rateForDate;
  });

  // calculate the perStay rate for this booking
  if (rateForUnitType) total += rateForUnitType.feePerStay;
  for (const key in guestTypeCounts) {
    const applicableRate = ratesForGuests.find(
      (rate: GuestFeesCalendar) => rate.guestTypeId === parseInt(key)
    );
    if (applicableRate)
      total += applicableRate.feePerStay * guestTypeCounts[key];
  }
  for (const extra in extras) {
    const applicableRate = ratesForExtras.find(
      (rate: ExtraFeesCalendar) => rate.extraTypeId === parseInt(extra)
    );
    if (applicableRate) total += applicableRate.feePerStay;
  }

  // return the calculated rate
  return total;
}

export async function confirmRequestedDatesAreAvailableForUnit(
  prisma: PrismaClient,
  unitId: number,
  startDate: Date,
  endDate: Date,
): Promise<{ applicableCalendarEntries: any[], areAllDatesAvailable: boolean }> {
  const applicableCalendarEntries = await prisma.calendar.findMany({
    where: {
      unitId: unitId,
      date: {
        gte: new Date(startDate),
        lt: new Date(endDate),
      },
    },
  });

  const areAllDatesAvailable = applicableCalendarEntries.every(
    (entry) => entry.bookingId === null
  );

  return { applicableCalendarEntries, areAllDatesAvailable };
}