/*
  Warnings:

  - Added the required column `description` to the `UnitType` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UnitType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "siteId" INTEGER NOT NULL,
    CONSTRAINT "UnitType_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UnitType" ("id", "name", "siteId") SELECT "id", "name", "siteId" FROM "UnitType";
DROP TABLE "UnitType";
ALTER TABLE "new_UnitType" RENAME TO "UnitType";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
