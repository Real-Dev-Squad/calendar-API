/*
  Warnings:

  - The primary key for the `accesstoken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `accesstoken` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `updatedAt` to the `AccessToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `AccessToken_id_key` ON `accesstoken`;

-- AlterTable
ALTER TABLE `accesstoken` DROP PRIMARY KEY,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
