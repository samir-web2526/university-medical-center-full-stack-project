-- DropForeignKey
ALTER TABLE "doctor" DROP CONSTRAINT "doctor_userId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_userId_fkey";

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
