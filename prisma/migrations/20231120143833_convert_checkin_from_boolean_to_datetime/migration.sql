/*
  Warnings:

  - You are about to alter the column `checkedIn` on the `BookingVehicle` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `DateTime`.
  - You are about to alter the column `checkedIn` on the `BookingGuest` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `DateTime`.
  - You are about to alter the column `checkedIn` on the `BookingPet` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookingVehicle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "vehicleReg" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "checkedIn" DATETIME,
    CONSTRAINT "BookingVehicle_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingVehicle" ("bookingId", "checkedIn", "end", "id", "start", "vehicleReg") SELECT "bookingId", "checkedIn", "end", "id", "start", "vehicleReg" FROM "BookingVehicle";
DROP TABLE "BookingVehicle";
ALTER TABLE "new_BookingVehicle" RENAME TO "BookingVehicle";
CREATE TABLE "new_BookingGuest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "guestTypeId" INTEGER NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "checkedIn" DATETIME,
    CONSTRAINT "BookingGuest_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookingGuest_guestTypeId_fkey" FOREIGN KEY ("guestTypeId") REFERENCES "GuestType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingGuest" ("bookingId", "checkedIn", "end", "guestTypeId", "id", "name", "start") SELECT "bookingId", "checkedIn", "end", "guestTypeId", "id", "name", "start" FROM "BookingGuest";
DROP TABLE "BookingGuest";
ALTER TABLE "new_BookingGuest" RENAME TO "BookingGuest";
CREATE TABLE "new_BookingPet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "checkedIn" DATETIME,
    CONSTRAINT "BookingPet_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingPet" ("bookingId", "checkedIn", "end", "id", "name", "start") SELECT "bookingId", "checkedIn", "end", "id", "name", "start" FROM "BookingPet";
DROP TABLE "BookingPet";
ALTER TABLE "new_BookingPet" RENAME TO "BookingPet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
