/*
  Warnings:

  - Added the required column `noteType` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "leadGuestId" INTEGER,
    "bookingId" INTEGER,
    "paymentId" INTEGER,
    "bookingGuestId" INTEGER,
    "bookingPetId" INTEGER,
    "bookingVehicleId" INTEGER,
    "createdOn" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "noteType" TEXT NOT NULL,
    CONSTRAINT "Note_leadGuestId_fkey" FOREIGN KEY ("leadGuestId") REFERENCES "LeadGuest" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Note_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Note_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Note_bookingGuestId_fkey" FOREIGN KEY ("bookingGuestId") REFERENCES "BookingGuest" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Note_bookingPetId_fkey" FOREIGN KEY ("bookingPetId") REFERENCES "BookingPet" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Note_bookingVehicleId_fkey" FOREIGN KEY ("bookingVehicleId") REFERENCES "BookingVehicle" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("bookingGuestId", "bookingId", "bookingPetId", "bookingVehicleId", "content", "createdOn", "id", "leadGuestId", "paymentId", "userId") SELECT "bookingGuestId", "bookingId", "bookingPetId", "bookingVehicleId", "content", "createdOn", "id", "leadGuestId", "paymentId", "userId" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
