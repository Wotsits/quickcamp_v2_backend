import { BookingGuest} from "@prisma/client";

export function isGuestDue(guest: BookingGuest) {
  const now = new Date();

  const start = new Date(guest.start);
  // set the start to the beginning of the day, allows processing of early arrivals
  start.setHours(0, 0, 0, 0);

  return now >= start;
}
