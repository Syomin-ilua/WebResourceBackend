/*
  Warnings:

  - You are about to drop the column `couseNameLower` on the `Course` table. All the data in the column will be lost.
  - Added the required column `courseNameLower` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseName" TEXT NOT NULL,
    "courseNameLower" TEXT NOT NULL,
    "courseDescription" TEXT NOT NULL,
    "courseImage" TEXT NOT NULL,
    "theoreticalMaterials" TEXT NOT NULL
);
INSERT INTO "new_Course" ("courseDescription", "courseImage", "courseName", "id", "theoreticalMaterials") SELECT "courseDescription", "courseImage", "courseName", "id", "theoreticalMaterials" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
