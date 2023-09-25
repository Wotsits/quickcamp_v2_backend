-- CreateTable
CREATE TABLE "Extra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExtraToUnitType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ExtraToUnitType_A_fkey" FOREIGN KEY ("A") REFERENCES "Extra" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ExtraToUnitType_B_fkey" FOREIGN KEY ("B") REFERENCES "UnitType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExtraToUnitType_AB_unique" ON "_ExtraToUnitType"("A", "B");

-- CreateIndex
CREATE INDEX "_ExtraToUnitType_B_index" ON "_ExtraToUnitType"("B");
