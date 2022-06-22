-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "activeOrganization" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otp" INTEGER,
    "otp_exp_date" DATETIME
);
INSERT INTO "new_User" ("activeOrganization", "id", "name", "otp", "otp_exp_date", "password", "phone_number") SELECT "activeOrganization", "id", "name", "otp", "otp_exp_date", "password", "phone_number" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
