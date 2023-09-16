/*
  Warnings:

  - You are about to drop the column `username` on the `Guest` table. All the data in the column will be lost.
  - Added the required column `email` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT NOT NULL,
    "townCity" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Guest" ("address1", "address2", "firstName", "id", "lastName", "password", "postcode", "tel", "townCity") SELECT "address1", "address2", "firstName", "id", "lastName", "password", "postcode", "tel", "townCity" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
