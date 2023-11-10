/*
  Warnings:

  - You are about to drop the column `usersId` on the `ChildEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Calendar` ADD COLUMN `isPrimary` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `ChildEvent` DROP COLUMN `usersId`;
