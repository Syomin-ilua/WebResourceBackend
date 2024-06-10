/*
  Warnings:

  - The primary key for the `LibraryCard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `LibraryCard` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LibraryCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardNumber" TEXT NOT NULL,
    "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "LibraryCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LibraryCard" ("cardNumber", "issueDate", "userId") SELECT "cardNumber", "issueDate", "userId" FROM "LibraryCard";
DROP TABLE "LibraryCard";
ALTER TABLE "new_LibraryCard" RENAME TO "LibraryCard";
CREATE UNIQUE INDEX "LibraryCard_userId_key" ON "LibraryCard"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
