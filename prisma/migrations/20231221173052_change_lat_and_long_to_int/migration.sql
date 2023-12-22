/*
  Warnings:

  - You are about to alter the column `latitude` on the `Site` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `longitude` on the `Site` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Site" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "townCity" TEXT NOT NULL,
    "county" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "tenantId" INTEGER NOT NULL,
    CONSTRAINT "Site_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Site" ("address1", "address2", "country", "county", "description", "email", "id", "latitude", "longitude", "name", "postcode", "tel", "tenantId", "townCity", "website") SELECT "address1", "address2", "country", "county", "description", "email", "id", "latitude", "longitude", "name", "postcode", "tel", "tenantId", "townCity", "website" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
