/*
  Warnings:

  - You are about to drop the column `age` on the `BookingGuest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookingGuest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "guestTypeId" INTEGER NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "checkedIn" BOOLEAN NOT NULL,
    CONSTRAINT "BookingGuest_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookingGuest_guestTypeId_fkey" FOREIGN KEY ("guestTypeId") REFERENCES "GuestType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingGuest" ("bookingId", "checkedIn", "end", "guestTypeId", "id", "name", "start") SELECT "bookingId", "checkedIn", "end", "guestTypeId", "id", "name", "start" FROM "BookingGuest";
DROP TABLE "BookingGuest";
ALTER TABLE "new_BookingGuest" RENAME TO "BookingGuest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
