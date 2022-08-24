/*
  Warnings:

  - A unique constraint covering the columns `[photoId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Like_photoId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Like_photoId_key" ON "Like"("photoId");
