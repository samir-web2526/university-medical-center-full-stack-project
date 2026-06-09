-- AlterTable
ALTER TABLE "prescription" ADD COLUMN     "prescriptionImage" TEXT,
ALTER COLUMN "diagnosis" DROP NOT NULL;

-- AlterTable
ALTER TABLE "prescription_medicine" ADD COLUMN     "quantity" INTEGER;
