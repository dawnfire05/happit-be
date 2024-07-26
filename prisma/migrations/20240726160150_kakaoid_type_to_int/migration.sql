/*
  Warnings:

  - The `kakaoId` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "kakaoId",
ADD COLUMN     "kakaoId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "user_kakaoId_key" ON "user"("kakaoId");
