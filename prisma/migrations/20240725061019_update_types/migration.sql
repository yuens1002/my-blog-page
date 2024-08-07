/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PUBLISHED', 'DRAFT', 'INACTIVE');

-- DropIndex
DROP INDEX "Post_tags_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "publishedAt",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DRAFT';
