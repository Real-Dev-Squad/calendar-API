/*
  Warnings:

  - You are about to drop the `ChildEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParentEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `ChildEvent`;

-- DropTable
DROP TABLE `ParentEvent`;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `ownerId` INTEGER NOT NULL,
    `eventTypeId` INTEGER NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
