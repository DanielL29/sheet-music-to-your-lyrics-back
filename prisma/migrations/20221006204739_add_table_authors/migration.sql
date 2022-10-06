/*
  Warnings:

  - You are about to drop the column `author` on the `musics` table. All the data in the column will be lost.
  - Made the column `imageUrl` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `authorId` to the `musics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "imageUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "musics" DROP COLUMN "author",
ADD COLUMN     "authorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "authors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "musics" ADD CONSTRAINT "musics_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
