/*
  Warnings:

  - You are about to drop the column `description` on the `subcollection` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `subcollection` table. All the data in the column will be lost.
  - Added the required column `bibleId` to the `Subcollection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookId` to the `Subcollection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chapterId` to the `Subcollection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Subcollection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Subcollection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verseId` to the `Subcollection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subcollection` DROP COLUMN `description`,
    DROP COLUMN `name`,
    ADD COLUMN `bibleId` VARCHAR(191) NOT NULL,
    ADD COLUMN `bookId` VARCHAR(191) NOT NULL,
    ADD COLUMN `chapterId` VARCHAR(191) NOT NULL,
    ADD COLUMN `content` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `verseId` VARCHAR(191) NOT NULL;
