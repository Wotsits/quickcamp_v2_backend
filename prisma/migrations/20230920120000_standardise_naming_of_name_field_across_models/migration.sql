/*
  Warnings:

  - You are about to drop the column `guestName` on the `BookingGuest` table. All the data in the column will be lost.
  - You are about to drop the column `petName` on the `BookingPet` table. All the data in the column will be lost.
  - Added the required column `name` to the `BookingGuest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `BookingPet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookingGuest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "checkedIn" BOOLEAN NOT NULL,
    CONSTRAINT "BookingGuest_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingGuest" ("age", "bookingId", "checkedIn", "end", "id", "start") SELECT "age", "bookingId", "checkedIn", "end", "id", "start" FROM "BookingGuest";
DROP TABLE "BookingGuest";
ALTER TABLE "new_BookingGuest" RENAME TO "BookingGuest";
CREATE TABLE "new_BookingPet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "checkedIn" BOOLEAN NOT NULL,
    CONSTRAINT "BookingPet_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingPet" ("bookingId", "checkedIn", "end", "id", "start") SELECT "bookingId", "checkedIn", "end", "id", "start" FROM "BookingPet";
DROP TABLE "BookingPet";
ALTER TABLE "new_BookingPet" RENAME TO "BookingPet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
