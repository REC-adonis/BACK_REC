/*
  Warnings:

  - Made the column `password` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(191) NOT NULL,
    MODIFY `isVerified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `resetPasswordToken` VARCHAR(191) NULL,
    MODIFY `resetPasswordExpiresAt` DATETIME(3) NULL;
