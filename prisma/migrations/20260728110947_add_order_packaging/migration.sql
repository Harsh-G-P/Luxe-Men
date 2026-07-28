-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "giftMessage" TEXT,
ADD COLUMN     "packagingOption" TEXT,
ADD COLUMN     "removeInvoice" BOOLEAN NOT NULL DEFAULT false;
