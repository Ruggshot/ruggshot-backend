/*
  Warnings:

  - Added the required column `status` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Beaf` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "zip_code" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "userId" INTEGER,
    "organizationId" INTEGER,
    "categoryId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("categoryId", "city", "createdAt", "first_name", "id", "last_name", "organizationId", "phone_number", "updatedAt", "userId", "zip_code") SELECT "categoryId", "city", "createdAt", "first_name", "id", "last_name", "organizationId", "phone_number", "updatedAt", "userId", "zip_code" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Beaf" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "galleryId" INTEGER,
    "eventId" INTEGER,
    "featureId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Beaf_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Beaf_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Beaf_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Beaf" ("eventId", "featureId", "galleryId", "id") SELECT "eventId", "featureId", "galleryId", "id" FROM "Beaf";
DROP TABLE "Beaf";
ALTER TABLE "new_Beaf" RENAME TO "Beaf";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
