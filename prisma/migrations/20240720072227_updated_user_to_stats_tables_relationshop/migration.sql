-- DropForeignKey
ALTER TABLE "Stats" DROP CONSTRAINT "Stats_favdById_fkey";

-- CreateTable
CREATE TABLE "_StatsToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StatsToUser_AB_unique" ON "_StatsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_StatsToUser_B_index" ON "_StatsToUser"("B");

-- AddForeignKey
ALTER TABLE "_StatsToUser" ADD CONSTRAINT "_StatsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Stats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StatsToUser" ADD CONSTRAINT "_StatsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
