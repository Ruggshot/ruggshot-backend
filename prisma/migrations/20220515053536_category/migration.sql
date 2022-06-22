-- CreateTable
CREATE TABLE "_BeafToOption" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Beaf" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Option" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Beaf" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "galleryId" INTEGER,
    "eventId" INTEGER,
    "featureId" INTEGER,
    CONSTRAINT "Beaf_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Beaf_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Beaf_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Beaf" ("eventId", "galleryId", "id") SELECT "eventId", "galleryId", "id" FROM "Beaf";
DROP TABLE "Beaf";
ALTER TABLE "new_Beaf" RENAME TO "Beaf";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT,
    "activeOrganization" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otp" INTEGER,
    "otp_exp_date" DATETIME
);
INSERT INTO "new_User" ("activeOrganization", "createdAt", "id", "name", "otp", "otp_exp_date", "password", "phone_number") SELECT "activeOrganization", "createdAt", "id", "name", "otp", "otp_exp_date", "password", "phone_number" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_BeafToOption_AB_unique" ON "_BeafToOption"("A", "B");

-- CreateIndex
CREATE INDEX "_BeafToOption_B_index" ON "_BeafToOption"("B");
