-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_statsId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "statsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_statsId_fkey" FOREIGN KEY ("statsId") REFERENCES "Stats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
