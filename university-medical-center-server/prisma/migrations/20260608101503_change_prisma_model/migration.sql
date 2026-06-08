/*
  Warnings:

  - You are about to drop the column `phone` on the `doctor` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");
