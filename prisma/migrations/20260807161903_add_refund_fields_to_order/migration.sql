-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('NONE', 'REQUESTED', 'REJECTED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "refundReason" TEXT,
ADD COLUMN     "refundRequestedAt" TIMESTAMP(3),
ADD COLUMN     "refundStatus" "RefundStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "refundedAt" TIMESTAMP(3);
