/*
  Warnings:

  - You are about to drop the `Profsouz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Venue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `venueId` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `profsouzId` on the `User` table. All the data in the column will be lost.
  - Added the required column `eventLocation` to the `SportEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Profsouz";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Venue";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Union" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "unionId" INTEGER NOT NULL,
    CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Membership_unionId_fkey" FOREIGN KEY ("unionId") REFERENCES "Union" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "sportEventId" INTEGER NOT NULL,
    CONSTRAINT "Participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participation_sportEventId_fkey" FOREIGN KEY ("sportEventId") REFERENCES "SportEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SportEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventLocation" TEXT NOT NULL
);
INSERT INTO "new_SportEvent" ("description", "id", "name") SELECT "description", "id", "name" FROM "SportEvent";
DROP TABLE "SportEvent";
ALTER TABLE "new_SportEvent" RENAME TO "SportEvent";
CREATE TABLE "new_Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sportEventId" INTEGER NOT NULL,
    "dayOfWeekId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    CONSTRAINT "Schedule_sportEventId_fkey" FOREIGN KEY ("sportEventId") REFERENCES "SportEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Schedule_dayOfWeekId_fkey" FOREIGN KEY ("dayOfWeekId") REFERENCES "DayOfWeek" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("dayOfWeekId", "endTime", "id", "sportEventId", "startTime") SELECT "dayOfWeekId", "endTime", "id", "sportEventId", "startTime" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surname" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "patronymic" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatarURL" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "adminType" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("adminType", "avatarURL", "email", "id", "password", "patronymic", "position", "surname", "tel", "userName") SELECT "adminType", "avatarURL", "email", "id", "password", "patronymic", "position", "surname", "tel", "userName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Union_name_key" ON "Union"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_unionId_key" ON "Membership"("userId", "unionId");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_userId_sportEventId_key" ON "Participation"("userId", "sportEventId");
