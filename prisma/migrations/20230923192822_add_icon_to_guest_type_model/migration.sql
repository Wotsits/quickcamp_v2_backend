/*
  Warnings:

  - Added the required column `icon` to the `GuestType` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GuestType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "siteId" INTEGER NOT NULL,
    CONSTRAINT "GuestType_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GuestType" ("id", "name", "siteId") SELECT "id", "name", "siteId" FROM "GuestType";
DROP TABLE "GuestType";
ALTER TABLE "new_GuestType" RENAME TO "GuestType";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
