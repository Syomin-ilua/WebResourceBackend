/*
  Warnings:

  - You are about to drop the `SportEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SportEvent";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventLocation" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "sportEventId" INTEGER NOT NULL,
    CONSTRAINT "Participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participation_sportEventId_fkey" FOREIGN KEY ("sportEventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Participation" ("id", "sportEventId", "userId") SELECT "id", "sportEventId", "userId" FROM "Participation";
DROP TABLE "Participation";
ALTER TABLE "new_Participation" RENAME TO "Participation";
CREATE UNIQUE INDEX "Participation_userId_sportEventId_key" ON "Participation"("userId", "sportEventId");
CREATE TABLE "new_Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sportEventId" INTEGER NOT NULL,
    "dayOfWeekId" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    CONSTRAINT "Schedule_sportEventId_fkey" FOREIGN KEY ("sportEventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Schedule_dayOfWeekId_fkey" FOREIGN KEY ("dayOfWeekId") REFERENCES "DayOfWeek" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("dayOfWeekId", "endTime", "id", "sportEventId", "startTime") SELECT "dayOfWeekId", "endTime", "id", "sportEventId", "startTime" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
