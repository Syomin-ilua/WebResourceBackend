-- CreateTable
CREATE TABLE "User" (
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

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseName" TEXT NOT NULL,
    "couseNameLower" TEXT NOT NULL,
    "courseImage" TEXT NOT NULL,
    "theoreticalMaterials" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    CONSTRAINT "Question_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrainingMaterials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameTrainingMaterials" TEXT NOT NULL,
    "imageTrainingMaterials" TEXT NOT NULL,
    "fileTrainingMaterials" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ResultsCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resultProcent" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    CONSTRAINT "ResultsCourse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ResultsCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
