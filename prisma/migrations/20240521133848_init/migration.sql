/*
  Warnings:

  - Added the required column `eventPicture` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventLocation" TEXT NOT NULL,
    "eventPicture" TEXT NOT NULL
);
INSERT INTO "new_Event" ("description", "eventLocation", "id", "name") SELECT "description", "eventLocation", "id", "name" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
