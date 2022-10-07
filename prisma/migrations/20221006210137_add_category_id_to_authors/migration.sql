/*
  Warnings:

  - Added the required column `categoryId` to the `authors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "authors" ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
