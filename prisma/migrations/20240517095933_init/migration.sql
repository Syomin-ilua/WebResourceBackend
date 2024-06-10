/*
  Warnings:

  - Added the required column `categoryNews` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_News" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "newsName" TEXT NOT NULL,
    "newsDescription" TEXT NOT NULL,
    "categoryNews" TEXT NOT NULL,
    "newsImage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_News" ("createdAt", "id", "newsDescription", "newsImage", "newsName", "updatedAt") SELECT "createdAt", "id", "newsDescription", "newsImage", "newsName", "updatedAt" FROM "News";
DROP TABLE "News";
ALTER TABLE "new_News" RENAME TO "News";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
