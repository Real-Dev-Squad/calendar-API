/*
  Warnings:

  - You are about to drop the column `eventTypeId` on the `ChildEvent` table. All the data in the column will be lost.
  - Changed the type of `expiry` on the `AccessToken` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `calendarId` to the `ChildEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AccessToken` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    DROP COLUMN `expiry`,
    ADD COLUMN `expiry` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `ChildEvent` DROP COLUMN `eventTypeId`,
    ADD COLUMN `calendarId` INTEGER NOT NULL;
