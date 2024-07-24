/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostToTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tags]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Made the column `postId` on table `Stats` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Stats" DROP CONSTRAINT "Stats_postId_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToTag" DROP CONSTRAINT "_PostToTag_B_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "Stats" ALTER COLUMN "postId" SET NOT NULL;

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_PostToTag";

-- CreateIndex
CREATE UNIQUE INDEX "Post_tags_key" ON "Post"("tags");

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
