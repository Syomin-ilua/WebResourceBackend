/*
  Warnings:

  - Added the required column `nameBookLower` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameBook" TEXT NOT NULL,
    "nameBookLower" TEXT NOT NULL,
    "descriptionBook" TEXT NOT NULL,
    "imageBook" TEXT NOT NULL,
    "fileBook" TEXT NOT NULL
);
INSERT INTO "new_Book" ("descriptionBook", "fileBook", "id", "imageBook", "nameBook") SELECT "descriptionBook", "fileBook", "id", "imageBook", "nameBook" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
