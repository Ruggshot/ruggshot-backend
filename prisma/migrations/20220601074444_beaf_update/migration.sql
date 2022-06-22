-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Beaf" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "galleryId" INTEGER,
    "eventId" INTEGER,
    "featureId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Beaf_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Beaf_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Beaf_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Beaf" ("createdAt", "eventId", "featureId", "galleryId", "id", "updatedAt") SELECT "createdAt", "eventId", "featureId", "galleryId", "id", "updatedAt" FROM "Beaf";
DROP TABLE "Beaf";
ALTER TABLE "new_Beaf" RENAME TO "Beaf";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
