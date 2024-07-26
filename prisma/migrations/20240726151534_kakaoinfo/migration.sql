/*
  Warnings:

  - A unique constraint covering the columns `[kakaoId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "kakaoAccessToken" TEXT,
ADD COLUMN     "kakaoId" TEXT,
ADD COLUMN     "kakaoRefreshToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_kakaoId_key" ON "user"("kakaoId");
