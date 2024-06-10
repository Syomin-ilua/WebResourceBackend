-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameBook" TEXT NOT NULL,
    "nameBookLower" TEXT NOT NULL,
    "descriptionBook" TEXT NOT NULL,
    "categoryBook" TEXT NOT NULL DEFAULT 'Технические',
    "imageBook" TEXT NOT NULL,
    "fileBook" TEXT NOT NULL
);
INSERT INTO "new_Book" ("descriptionBook", "fileBook", "id", "imageBook", "nameBook", "nameBookLower") SELECT "descriptionBook", "fileBook", "id", "imageBook", "nameBook", "nameBookLower" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
