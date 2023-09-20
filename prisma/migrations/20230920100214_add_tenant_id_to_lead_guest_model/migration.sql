/*
  Warnings:

  - Added the required column `tenantId` to the `LeadGuest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LeadGuest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "townCity" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tenantId" INTEGER NOT NULL,
    CONSTRAINT "LeadGuest_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LeadGuest" ("address1", "address2", "email", "firstName", "id", "lastName", "password", "postcode", "tel", "townCity") SELECT "address1", "address2", "email", "firstName", "id", "lastName", "password", "postcode", "tel", "townCity" FROM "LeadGuest";
DROP TABLE "LeadGuest";
ALTER TABLE "new_LeadGuest" RENAME TO "LeadGuest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
