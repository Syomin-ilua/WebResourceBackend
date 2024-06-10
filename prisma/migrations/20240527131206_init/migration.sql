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
    "role" TEXT NOT NULL DEFAULT 'USER',
    "adminType" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("adminType", "avatarURL", "email", "id", "password", "patronymic", "position", "surname", "tel", "userName") SELECT "adminType", "avatarURL", "email", "id", "password", "patronymic", "position", "surname", "tel", "userName" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
