-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "option_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "parent_feat_id" INTEGER NOT NULL,
    "imageId" INTEGER,
    CONSTRAINT "Option_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Option" ("active", "id", "option_name", "parent_feat_id") SELECT "active", "id", "option_name", "parent_feat_id" FROM "Option";
DROP TABLE "Option";
ALTER TABLE "new_Option" RENAME TO "Option";
CREATE UNIQUE INDEX "Option_parent_feat_id_option_name_key" ON "Option"("parent_feat_id", "option_name");
CREATE TABLE "new_Feature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "feature_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "parent_cat_id" INTEGER NOT NULL,
    "imageId" INTEGER,
    CONSTRAINT "Feature_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Feature" ("active", "feature_name", "id", "parent_cat_id") SELECT "active", "feature_name", "id", "parent_cat_id" FROM "Feature";
DROP TABLE "Feature";
ALTER TABLE "new_Feature" RENAME TO "Feature";
CREATE UNIQUE INDEX "Feature_parent_cat_id_feature_name_key" ON "Feature"("parent_cat_id", "feature_name");
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "imageId" INTEGER,
    CONSTRAINT "Category_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("active", "category_name", "id") SELECT "active", "category_name", "id" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_category_name_key" ON "Category"("category_name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
