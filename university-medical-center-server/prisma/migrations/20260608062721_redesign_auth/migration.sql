-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isProfileComplete" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT false;
