/*
  Warnings:

  - A unique constraint covering the columns `[siteId,name]` on the table `GuestType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GuestType_siteId_name_key" ON "GuestType"("siteId", "name");
