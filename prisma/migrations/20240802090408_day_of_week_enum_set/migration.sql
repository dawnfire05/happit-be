/*
  Warnings:

  - The `repeatDay` column on the `Habit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `repeatType` on the `Habit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'none');

-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM ('daily', 'weekly');

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "repeatType",
ADD COLUMN     "repeatType" "RepeatType" NOT NULL,
DROP COLUMN "repeatDay",
ADD COLUMN     "repeatDay" "DayOfWeek"[];
