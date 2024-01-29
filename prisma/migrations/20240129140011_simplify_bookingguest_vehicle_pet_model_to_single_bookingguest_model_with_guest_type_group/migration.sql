/*
  Warnings:

  - You are about to drop the `BookingPet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookingVehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PetFeesCalendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleFeesCalendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `bookingPetId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `bookingVehicleId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `GuestType` table. All the data in the column will be lost.
  - Added the required column `guestTypeGroupId` to the `GuestType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identifierLabel` to the `GuestType` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BookingPet";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BookingVehicle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PetFeesCalendar";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VehicleFeesCalendar";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "GuestTypeGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "siteId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "GuestTypeGroup_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "leadGuestId" INTEGER,
    "bookingId" INTEGER,
    "paymentId" INTEGER,
    "bookingGuestId" INTEGER,
    "createdOn" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "noteType" TEXT NOT NULL,
    CONSTRAINT "Note_leadGuestId_fkey" FOREIGN KEY ("leadGuestId") REFERENCES "LeadGuest" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Note_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Note_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Note_bookingGuestId_fkey" FOREIGN KEY ("bookingGuestId") REFERENCES "BookingGuest" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("bookingGuestId", "bookingId", "content", "createdOn", "id", "leadGuestId", "noteType", "paymentId", "userId") SELECT "bookingGuestId", "bookingId", "content", "createdOn", "id", "leadGuestId", "noteType", "paymentId", "userId" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
CREATE TABLE "new_GuestType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "identifierLabel" TEXT NOT NULL,
    "guestTypeGroupId" INTEGER NOT NULL,
    CONSTRAINT "GuestType_guestTypeGroupId_fkey" FOREIGN KEY ("guestTypeGroupId") REFERENCES "GuestTypeGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GuestType" ("description", "icon", "id", "name") SELECT "description", "icon", "id", "name" FROM "GuestType";
DROP TABLE "GuestType";
ALTER TABLE "new_GuestType" RENAME TO "GuestType";
CREATE UNIQUE INDEX "GuestType_name_key" ON "GuestType"("name");
CREATE UNIQUE INDEX "GuestType_guestTypeGroupId_name_key" ON "GuestType"("guestTypeGroupId", "name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
