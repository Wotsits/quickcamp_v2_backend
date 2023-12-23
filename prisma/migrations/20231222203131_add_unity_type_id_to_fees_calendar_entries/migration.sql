/*
  Warnings:

  - Added the required column `unitTypeId` to the `VehicleFeesCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitTypeId` to the `ExtraFeesCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitTypeId` to the `PetFeesCalendar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitTypeId` to the `GuestFeesCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VehicleFeesCalendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "unitTypeId" INTEGER NOT NULL,
    "feePerNight" REAL NOT NULL,
    "feePerStay" REAL NOT NULL,
    CONSTRAINT "VehicleFeesCalendar_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VehicleFeesCalendar" ("date", "feePerNight", "feePerStay", "id") SELECT "date", "feePerNight", "feePerStay", "id" FROM "VehicleFeesCalendar";
DROP TABLE "VehicleFeesCalendar";
ALTER TABLE "new_VehicleFeesCalendar" RENAME TO "VehicleFeesCalendar";
CREATE TABLE "new_ExtraFeesCalendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "extraTypeId" INTEGER NOT NULL,
    "unitTypeId" INTEGER NOT NULL,
    "feePerNight" REAL NOT NULL,
    "feePerStay" REAL NOT NULL,
    CONSTRAINT "ExtraFeesCalendar_extraTypeId_fkey" FOREIGN KEY ("extraTypeId") REFERENCES "ExtraType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExtraFeesCalendar_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExtraFeesCalendar" ("date", "extraTypeId", "feePerNight", "feePerStay", "id") SELECT "date", "extraTypeId", "feePerNight", "feePerStay", "id" FROM "ExtraFeesCalendar";
DROP TABLE "ExtraFeesCalendar";
ALTER TABLE "new_ExtraFeesCalendar" RENAME TO "ExtraFeesCalendar";
CREATE TABLE "new_PetFeesCalendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "unitTypeId" INTEGER NOT NULL,
    "feePerNight" REAL NOT NULL,
    "feePerStay" REAL NOT NULL,
    CONSTRAINT "PetFeesCalendar_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PetFeesCalendar" ("date", "feePerNight", "feePerStay", "id") SELECT "date", "feePerNight", "feePerStay", "id" FROM "PetFeesCalendar";
DROP TABLE "PetFeesCalendar";
ALTER TABLE "new_PetFeesCalendar" RENAME TO "PetFeesCalendar";
CREATE TABLE "new_GuestFeesCalendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "guestTypeId" INTEGER NOT NULL,
    "unitTypeId" INTEGER NOT NULL,
    "feePerNight" REAL NOT NULL,
    "feePerStay" REAL NOT NULL,
    CONSTRAINT "GuestFeesCalendar_guestTypeId_fkey" FOREIGN KEY ("guestTypeId") REFERENCES "GuestType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GuestFeesCalendar_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GuestFeesCalendar" ("date", "feePerNight", "feePerStay", "guestTypeId", "id") SELECT "date", "feePerNight", "feePerStay", "guestTypeId", "id" FROM "GuestFeesCalendar";
DROP TABLE "GuestFeesCalendar";
ALTER TABLE "new_GuestFeesCalendar" RENAME TO "GuestFeesCalendar";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
