-- CreateTable
CREATE TABLE "FeesCalendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "guestTypeId" INTEGER NOT NULL,
    "feePerNight" REAL NOT NULL,
    "feePerStay" REAL NOT NULL,
    CONSTRAINT "FeesCalendar_guestTypeId_fkey" FOREIGN KEY ("guestTypeId") REFERENCES "GuestType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExtraFeesCalendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "extraTypeId" INTEGER NOT NULL,
    "feePerNight" REAL NOT NULL,
    "feePerStay" REAL NOT NULL,
    CONSTRAINT "ExtraFeesCalendar_extraTypeId_fkey" FOREIGN KEY ("extraTypeId") REFERENCES "ExtraType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PetFeesCalendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "feePerNight" REAL NOT NULL,
    "feePerStay" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "VehicleFeesCalendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "feePerNight" REAL NOT NULL,
    "feePerStay" REAL NOT NULL
);
