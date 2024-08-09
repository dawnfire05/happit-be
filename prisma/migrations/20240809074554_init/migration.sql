/*
  Warnings:

  - Added the required column `themeColor` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Habit" ADD COLUMN     "noticeTime" TIMESTAMP(3)[],
ADD COLUMN     "themeColor" INTEGER NOT NULL;
