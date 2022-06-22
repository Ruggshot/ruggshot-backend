-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Beaf" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "galleryId" INTEGER,
    "eventId" INTEGER,
    CONSTRAINT "Beaf_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Beaf_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Beaf" ("eventId", "galleryId", "id") SELECT "eventId", "galleryId", "id" FROM "Beaf";
DROP TABLE "Beaf";
ALTER TABLE "new_Beaf" RENAME TO "Beaf";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
