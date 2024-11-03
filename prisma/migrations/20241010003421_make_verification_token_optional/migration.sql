-- AlterTable
ALTER TABLE `user` MODIFY `verificationToken` VARCHAR(191) NULL,
    MODIFY `verificationTokenExpiresAt` DATETIME(3) NULL;
