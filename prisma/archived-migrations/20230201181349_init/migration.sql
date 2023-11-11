/*
  Warnings:

  - You are about to drop the column `calendarId` on the `ChildEvent` table. All the data in the column will be lost.
  - You are about to drop the column `calendarId` on the `ParentEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ChildEvent` DROP COLUMN `calendarId`;

-- AlterTable
ALTER TABLE `ParentEvent` DROP COLUMN `calendarId`;
