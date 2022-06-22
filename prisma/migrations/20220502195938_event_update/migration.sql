/*
  Warnings:

  - You are about to drop the column `imageId` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Feature` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "userId" INTEGER,
    "categoryId" INTEGER,
    CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER,
    CONSTRAINT "Image_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("id") SELECT "id" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
CREATE TABLE "new_Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "option_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "parent_feat_id" INTEGER NOT NULL
);
INSERT INTO "new_Option" ("active", "id", "option_name", "parent_feat_id") SELECT "active", "id", "option_name", "parent_feat_id" FROM "Option";
DROP TABLE "Option";
ALTER TABLE "new_Option" RENAME TO "Option";
CREATE UNIQUE INDEX "Option_parent_feat_id_option_name_key" ON "Option"("parent_feat_id", "option_name");
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Category" ("active", "category_name", "id") SELECT "active", "category_name", "id" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_category_name_key" ON "Category"("category_name");
CREATE TABLE "new_Beaf" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "galleryId" INTEGER NOT NULL,
    "eventId" INTEGER,
    CONSTRAINT "Beaf_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Beaf_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Beaf" ("galleryId", "id") SELECT "galleryId", "id" FROM "Beaf";
DROP TABLE "Beaf";
ALTER TABLE "new_Beaf" RENAME TO "Beaf";
CREATE TABLE "new_Feature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "feature_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "parent_cat_id" INTEGER NOT NULL
);
INSERT INTO "new_Feature" ("active", "feature_name", "id", "parent_cat_id") SELECT "active", "feature_name", "id", "parent_cat_id" FROM "Feature";
DROP TABLE "Feature";
ALTER TABLE "new_Feature" RENAME TO "Feature";
CREATE UNIQUE INDEX "Feature_parent_cat_id_feature_name_key" ON "Feature"("parent_cat_id", "feature_name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
