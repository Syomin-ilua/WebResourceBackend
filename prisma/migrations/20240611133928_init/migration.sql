-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ResultsCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resultProcent" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "dataCourse" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ResultsCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ResultsCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ResultsCourse" ("courseId", "dataCourse", "id", "resultProcent", "userId") SELECT "courseId", "dataCourse", "id", "resultProcent", "userId" FROM "ResultsCourse";
DROP TABLE "ResultsCourse";
ALTER TABLE "new_ResultsCourse" RENAME TO "ResultsCourse";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
