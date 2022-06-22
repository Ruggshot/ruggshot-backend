/*
  Warnings:

  - Added the required column `otp_exp_date` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "activeOrganization" INTEGER,
    "otp" INTEGER,
    "otp_exp_date" DATETIME NOT NULL
);
INSERT INTO "new_User" ("activeOrganization", "id", "name", "password", "phone_number") SELECT "activeOrganization", "id", "name", "password", "phone_number" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
