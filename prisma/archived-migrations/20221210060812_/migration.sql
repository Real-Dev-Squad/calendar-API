-- AlterTable
ALTER TABLE `Calendar` ADD COLUMN `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isSelected` BOOLEAN NOT NULL DEFAULT false;
