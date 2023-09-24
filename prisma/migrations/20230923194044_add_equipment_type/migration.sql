/*
  Warnings:

  - Added the required column `guestTypeId` to the `BookingGuest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "EquipmentType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "siteId" INTEGER NOT NULL,
    CONSTRAINT "EquipmentType_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EquipmentTypeToUnitType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EquipmentTypeToUnitType_A_fkey" FOREIGN KEY ("A") REFERENCES "EquipmentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EquipmentTypeToUnitType_B_fkey" FOREIGN KEY ("B") REFERENCES "UnitType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookingGuest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "guestTypeId" INTEGER NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "checkedIn" BOOLEAN NOT NULL,
    CONSTRAINT "BookingGuest_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookingGuest_guestTypeId_fkey" FOREIGN KEY ("guestTypeId") REFERENCES "GuestType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingGuest" ("age", "bookingId", "checkedIn", "end", "id", "name", "start") SELECT "age", "bookingId", "checkedIn", "end", "id", "name", "start" FROM "BookingGuest";
DROP TABLE "BookingGuest";
ALTER TABLE "new_BookingGuest" RENAME TO "BookingGuest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_EquipmentTypeToUnitType_AB_unique" ON "_EquipmentTypeToUnitType"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipmentTypeToUnitType_B_index" ON "_EquipmentTypeToUnitType"("B");
