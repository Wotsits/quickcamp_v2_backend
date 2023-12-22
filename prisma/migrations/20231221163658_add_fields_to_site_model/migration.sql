/*
  Warnings:

  - Added the required column `address1` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `county` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postcode` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tel` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `townCity` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `Site` table without a default value. This is not possible if the table is not empty.

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
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "tenantId" INTEGER NOT NULL,
    CONSTRAINT "Site_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Site" ("id", "name", "tenantId") SELECT "id", "name", "tenantId" FROM "Site";
DROP TABLE "Site";
ALTER TABLE "new_Site" RENAME TO "Site";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
