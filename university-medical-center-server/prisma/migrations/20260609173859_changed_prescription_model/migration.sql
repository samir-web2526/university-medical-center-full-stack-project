/*
  Warnings:

  - Added the required column `dosageForm` to the `medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strength` to the `medicine` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PrescriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'OUT_OF_STOCK';

-- AlterTable
ALTER TABLE "medicine" ADD COLUMN     "description" TEXT,
ADD COLUMN     "dosageForm" TEXT NOT NULL,
ADD COLUMN     "strength" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "prescription" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "status" "PrescriptionStatus" NOT NULL DEFAULT 'ACTIVE';
