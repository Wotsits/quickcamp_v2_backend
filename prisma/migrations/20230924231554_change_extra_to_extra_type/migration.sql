/*
  Warnings:

  - You are about to drop the `Extra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExtraToUnitType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Extra";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ExtraToUnitType";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ExtraType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExtraTypeToUnitType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ExtraTypeToUnitType_A_fkey" FOREIGN KEY ("A") REFERENCES "ExtraType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ExtraTypeToUnitType_B_fkey" FOREIGN KEY ("B") REFERENCES "UnitType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExtraTypeToUnitType_AB_unique" ON "_ExtraTypeToUnitType"("A", "B");

-- CreateIndex
CREATE INDEX "_ExtraTypeToUnitType_B_index" ON "_ExtraTypeToUnitType"("B");
