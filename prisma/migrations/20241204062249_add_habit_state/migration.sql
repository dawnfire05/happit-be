/*
  Warnings:

  - Added the required column `state` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HabitState" AS ENUM ('done', 'notDone', 'skipped');

-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "state" "HabitState" NOT NULL;
