/*
  Warnings:

  - You are about to drop the `sheetMusics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sheetMusics" DROP CONSTRAINT "sheetMusics_musicId_fkey";

-- DropForeignKey
ALTER TABLE "sheetMusics" DROP CONSTRAINT "sheetMusics_userId_fkey";

-- AlterTable
ALTER TABLE "musicContributors" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "sheetMusics";

-- CreateTable
CREATE TABLE "musicSnippets" (
    "id" SERIAL NOT NULL,
    "musicSnippet" TEXT NOT NULL,
    "snippetAid" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "musicId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "musicSnippets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "musicSnippets" ADD CONSTRAINT "musicSnippets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musicSnippets" ADD CONSTRAINT "musicSnippets_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "musics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
