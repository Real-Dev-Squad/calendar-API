/*
  Warnings:

  - You are about to drop the column `isPrimary` on the `Calendar` table. All the data in the column will be lost.
  - You are about to drop the column `isSelected` on the `Calendar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Calendar` DROP COLUMN `isPrimary`,
    DROP COLUMN `isSelected`;
