/*
  Warnings:

  - You are about to drop the column `rating` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `favdById` on the `Stats` table. All the data in the column will be lost.
  - You are about to drop the `_StatsToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_StatsToUser" DROP CONSTRAINT "_StatsToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_StatsToUser" DROP CONSTRAINT "_StatsToUser_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "rating";

-- AlterTable
ALTER TABLE "Stats" DROP COLUMN "favdById";

-- DropTable
DROP TABLE "_StatsToUser";
