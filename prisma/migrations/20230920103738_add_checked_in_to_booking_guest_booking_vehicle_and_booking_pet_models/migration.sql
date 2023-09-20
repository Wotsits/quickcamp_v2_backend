/*
  Warnings:

  - Added the required column `checkedIn` to the `BookingGuest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkedIn` to the `BookingPet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkedIn` to the `BookingVehicle` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookingGuest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "guestName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "checkedIn" BOOLEAN NOT NULL,
    CONSTRAINT "BookingGuest_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingGuest" ("age", "bookingId", "end", "guestName", "id", "start") SELECT "age", "bookingId", "end", "guestName", "id", "start" FROM "BookingGuest";
DROP TABLE "BookingGuest";
ALTER TABLE "new_BookingGuest" RENAME TO "BookingGuest";
CREATE TABLE "new_BookingPet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "petName" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "checkedIn" BOOLEAN NOT NULL,
    CONSTRAINT "BookingPet_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingPet" ("bookingId", "end", "id", "petName", "start") SELECT "bookingId", "end", "id", "petName", "start" FROM "BookingPet";
DROP TABLE "BookingPet";
ALTER TABLE "new_BookingPet" RENAME TO "BookingPet";
CREATE TABLE "new_BookingVehicle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "vehicleReg" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "checkedIn" BOOLEAN NOT NULL,
    CONSTRAINT "BookingVehicle_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingVehicle" ("bookingId", "end", "id", "start", "vehicleReg") SELECT "bookingId", "end", "id", "start", "vehicleReg" FROM "BookingVehicle";
DROP TABLE "BookingVehicle";
ALTER TABLE "new_BookingVehicle" RENAME TO "BookingVehicle";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
