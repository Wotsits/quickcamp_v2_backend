/*
  Warnings:

  - Added the required column `siteId` to the `BookingGroup` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookingGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteId" INTEGER NOT NULL,
    CONSTRAINT "BookingGroup_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BookingGroup" ("id") SELECT "id" FROM "BookingGroup";
DROP TABLE "BookingGroup";
ALTER TABLE "new_BookingGroup" RENAME TO "BookingGroup";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
