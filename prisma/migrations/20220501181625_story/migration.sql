-- CreateTable
CREATE TABLE "Story" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "story_description" TEXT NOT NULL,
    "beafId" INTEGER NOT NULL,
    CONSTRAINT "Story_beafId_fkey" FOREIGN KEY ("beafId") REFERENCES "Beaf" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
