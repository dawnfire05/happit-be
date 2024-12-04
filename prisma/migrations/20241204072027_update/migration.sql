/*
  Warnings:

  - Changed the type of `state` on the `Record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Record" DROP COLUMN "state",
ADD COLUMN     "state" TEXT NOT NULL;

-- DropEnum
DROP TYPE "HabitState";
