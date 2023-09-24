/*
  Warnings:

  - Added the required column `description` to the `EquipmentType` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EquipmentType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "siteId" INTEGER NOT NULL,
    CONSTRAINT "EquipmentType_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EquipmentType" ("icon", "id", "name", "siteId") SELECT "icon", "id", "name", "siteId" FROM "EquipmentType";
DROP TABLE "EquipmentType";
ALTER TABLE "new_EquipmentType" RENAME TO "EquipmentType";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
