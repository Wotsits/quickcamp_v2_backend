/*
  Warnings:

  - You are about to drop the `FeesCalendar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FeesCalendar";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UnitTypeFeesCalendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "unitTypeId" INTEGER NOT NULL,
    "feePerNight" REAL NOT NULL,
    "feePerStay" REAL NOT NULL,
    CONSTRAINT "UnitTypeFeesCalendar_unitTypeId_fkey" FOREIGN KEY ("unitTypeId") REFERENCES "UnitType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GuestFeesCalendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "guestTypeId" INTEGER NOT NULL,
    "feePerNight" REAL NOT NULL,
    "feePerStay" REAL NOT NULL,
    CONSTRAINT "GuestFeesCalendar_guestTypeId_fkey" FOREIGN KEY ("guestTypeId") REFERENCES "GuestType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
