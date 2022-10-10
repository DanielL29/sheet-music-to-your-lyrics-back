/*
  Warnings:

  - A unique constraint covering the columns `[musicSnippet,musicId]` on the table `musicSnippets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "musicSnippets_musicSnippet_musicId_key" ON "musicSnippets"("musicSnippet", "musicId");
