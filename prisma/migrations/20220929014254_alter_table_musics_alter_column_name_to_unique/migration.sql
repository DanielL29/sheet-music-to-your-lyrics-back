/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `musics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "musics_name_key" ON "musics"("name");
