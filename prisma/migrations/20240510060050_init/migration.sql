/*
  Warnings:

  - You are about to drop the `TrainingMaterials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TrainingMaterials";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameBook" TEXT NOT NULL,
    "descriptionBook" TEXT NOT NULL,
    "imageBook" TEXT NOT NULL,
    "fileBook" TEXT NOT NULL
);
