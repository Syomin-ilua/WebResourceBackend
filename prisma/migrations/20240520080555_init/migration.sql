-- CreateTable
CREATE TABLE "Profsouz" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "SportEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DayOfWeek" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sportEventId" INTEGER NOT NULL,
    "dayOfWeekId" INTEGER NOT NULL,
    "venueId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    CONSTRAINT "Schedule_sportEventId_fkey" FOREIGN KEY ("sportEventId") REFERENCES "SportEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Schedule_dayOfWeekId_fkey" FOREIGN KEY ("dayOfWeekId") REFERENCES "DayOfWeek" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Schedule_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    "adminType" BOOLEAN NOT NULL DEFAULT false,
    "profsouzId" TEXT,
    CONSTRAINT "User_profsouzId_fkey" FOREIGN KEY ("profsouzId") REFERENCES "Profsouz" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("adminType", "avatarURL", "email", "id", "password", "patronymic", "position", "surname", "tel", "userName") SELECT "adminType", "avatarURL", "email", "id", "password", "patronymic", "position", "surname", "tel", "userName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "DayOfWeek_name_key" ON "DayOfWeek"("name");
