/*
  Warnings:

  - Added the required column `status` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "unitId" INTEGER NOT NULL,
    "totalFee" REAL NOT NULL,
    "leadGuestId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Booking_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_leadGuestId_fkey" FOREIGN KEY ("leadGuestId") REFERENCES "LeadGuest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("end", "id", "leadGuestId", "start", "totalFee", "unitId") SELECT "end", "id", "leadGuestId", "start", "totalFee", "unitId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
