/*
  Warnings:

  - Added the required column `companyId` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "companyId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
