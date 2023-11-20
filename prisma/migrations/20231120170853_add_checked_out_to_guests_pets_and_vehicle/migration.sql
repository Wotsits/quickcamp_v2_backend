-- AlterTable
ALTER TABLE "BookingGuest" ADD COLUMN "checkedOut" DATETIME;

-- AlterTable
ALTER TABLE "BookingPet" ADD COLUMN "checkedOut" DATETIME;

-- AlterTable
ALTER TABLE "BookingVehicle" ADD COLUMN "checkedOut" DATETIME;
