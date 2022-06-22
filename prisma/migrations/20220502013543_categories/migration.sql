-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "feature_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "parent_cat_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "option_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "parent_feat_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToFeature" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Feature" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FeatureToOption" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Feature" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Option" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_category_name_key" ON "Category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_parent_cat_id_feature_name_key" ON "Feature"("parent_cat_id", "feature_name");

-- CreateIndex
CREATE UNIQUE INDEX "Option_parent_feat_id_option_name_key" ON "Option"("parent_feat_id", "option_name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToFeature_AB_unique" ON "_CategoryToFeature"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToFeature_B_index" ON "_CategoryToFeature"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FeatureToOption_AB_unique" ON "_FeatureToOption"("A", "B");

-- CreateIndex
CREATE INDEX "_FeatureToOption_B_index" ON "_FeatureToOption"("B");
