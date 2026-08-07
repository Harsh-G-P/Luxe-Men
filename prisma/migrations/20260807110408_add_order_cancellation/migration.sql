-- CreateEnum
CREATE TYPE "CancellationStatus" AS ENUM ('NONE', 'REQUESTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancellationStatus" "CancellationStatus" NOT NULL DEFAULT 'NONE';

-- CreateIndex
CREATE INDEX "Order_cancellationStatus_idx" ON "Order"("cancellationStatus");
