/*
  Warnings:

  - Added the required column `calendarId` to the `ParentEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ParentEvent` ADD COLUMN `calendarId` INTEGER NOT NULL;
