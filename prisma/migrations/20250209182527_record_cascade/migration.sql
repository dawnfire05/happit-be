-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_habitId_fkey";

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
