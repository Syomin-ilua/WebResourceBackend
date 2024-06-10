-- CreateTable
CREATE TABLE "LibraryCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardNumber" TEXT NOT NULL,
    "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "LibraryCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameBook" TEXT NOT NULL,
    "nameBookLower" TEXT NOT NULL,
    "descriptionBook" TEXT NOT NULL,
    "categoryBook" TEXT NOT NULL DEFAULT 'technical',
    "imageBook" TEXT NOT NULL,
    "fileBook" TEXT NOT NULL
);
INSERT INTO "new_Book" ("categoryBook", "descriptionBook", "fileBook", "id", "imageBook", "nameBook", "nameBookLower") SELECT "categoryBook", "descriptionBook", "fileBook", "id", "imageBook", "nameBook", "nameBookLower" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "LibraryCard_cardNumber_key" ON "LibraryCard"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryCard_userId_key" ON "LibraryCard"("userId");
