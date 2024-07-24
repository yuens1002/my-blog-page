/*
  Warnings:

  - You are about to drop the column `statsId` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId]` on the table `Stats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `Stats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_statsId_fkey";

-- DropIndex
DROP INDEX "Post_statsId_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "statsId";

-- AlterTable
ALTER TABLE "Stats" ADD COLUMN     "postId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stats_postId_key" ON "Stats"("postId");

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
