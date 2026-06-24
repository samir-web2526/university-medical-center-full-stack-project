/*
  Warnings:

  - A unique constraint covering the columns `[name,strength,dosageForm]` on the table `medicine` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "medicine_name_strength_dosageForm_key" ON "medicine"("name", "strength", "dosageForm");
