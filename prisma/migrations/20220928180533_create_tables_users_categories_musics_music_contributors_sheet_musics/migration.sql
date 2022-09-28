-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musics" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lyric" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "translatedLyric" TEXT NOT NULL,
    "sheetMusicFile" TEXT,
    "musicVideoUrl" TEXT,
    "musicHelpVideoUrl" TEXT,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "musics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "musicContributors" (
    "musicId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "musicContributors_pkey" PRIMARY KEY ("musicId","userId")
);

-- CreateTable
CREATE TABLE "sheetMusics" (
    "id" SERIAL NOT NULL,
    "musicSnippet" TEXT NOT NULL,
    "snippetAid" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "musicId" INTEGER NOT NULL,

    CONSTRAINT "sheetMusics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "musics" ADD CONSTRAINT "musics_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musicContributors" ADD CONSTRAINT "musicContributors_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "musics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "musicContributors" ADD CONSTRAINT "musicContributors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheetMusics" ADD CONSTRAINT "sheetMusics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheetMusics" ADD CONSTRAINT "sheetMusics_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "musics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
