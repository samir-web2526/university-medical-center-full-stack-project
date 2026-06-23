-- AlterTable
ALTER TABLE "doctor" ADD COLUMN     "bmdcRegistrationNumber" TEXT;

-- AlterTable
ALTER TABLE "prescription" ADD COLUMN     "investigation" TEXT;

-- AlterTable
ALTER TABLE "prescription_medicine" ADD COLUMN     "frequency" TEXT;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "guardianNumber" TEXT,
ADD COLUMN     "permanentAddress" TEXT,
ADD COLUMN     "presentAddress" TEXT;

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
