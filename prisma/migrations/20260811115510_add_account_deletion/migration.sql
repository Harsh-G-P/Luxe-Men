-- CreateEnum
CREATE TYPE "AccountDeletionStatus" AS ENUM ('NONE', 'REQUESTED', 'REJECTED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountDeletedAt" TIMESTAMP(3),
ADD COLUMN     "accountDeletionReason" TEXT,
ADD COLUMN     "accountDeletionRequestedAt" TIMESTAMP(3),
ADD COLUMN     "accountDeletionStatus" "AccountDeletionStatus" NOT NULL DEFAULT 'NONE';
