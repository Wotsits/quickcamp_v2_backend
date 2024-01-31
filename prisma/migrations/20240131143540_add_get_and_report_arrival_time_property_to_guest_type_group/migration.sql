-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GuestTypeGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "siteId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "getAndReportArrivalTime" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "GuestTypeGroup_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GuestTypeGroup" ("id", "name", "order", "siteId") SELECT "id", "name", "order", "siteId" FROM "GuestTypeGroup";
DROP TABLE "GuestTypeGroup";
ALTER TABLE "new_GuestTypeGroup" RENAME TO "GuestTypeGroup";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
