-- AlterTable
ALTER TABLE "Habit" ADD COLUMN "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "longestStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastCompletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Record_habitId_date_idx" ON "Record"("habitId", "date");

-- CreateIndex
CREATE INDEX "Record_userId_date_idx" ON "Record"("userId", "date");
