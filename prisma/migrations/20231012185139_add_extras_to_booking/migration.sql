/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "_BookingToExtraType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BookingToExtraType_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BookingToExtraType_B_fkey" FOREIGN KEY ("B") REFERENCES "ExtraType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_BookingToExtraType_AB_unique" ON "_BookingToExtraType"("A", "B");

-- CreateIndex
CREATE INDEX "_BookingToExtraType_B_index" ON "_BookingToExtraType"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
