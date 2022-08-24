-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- CreateTable
CREATE TABLE "_LikeToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LikeToUser_AB_unique" ON "_LikeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LikeToUser_B_index" ON "_LikeToUser"("B");

-- AddForeignKey
ALTER TABLE "_LikeToUser" ADD CONSTRAINT "_LikeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Like"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikeToUser" ADD CONSTRAINT "_LikeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
