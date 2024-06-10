/*
  Warnings:

  - Added the required column `courseDescription` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseName" TEXT NOT NULL,
    "couseNameLower" TEXT NOT NULL,
    "courseDescription" TEXT NOT NULL,
    "courseImage" TEXT NOT NULL,
    "theoreticalMaterials" TEXT NOT NULL
);
INSERT INTO "new_Course" ("courseImage", "courseName", "couseNameLower", "id", "theoreticalMaterials") SELECT "courseImage", "courseName", "couseNameLower", "id", "theoreticalMaterials" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
