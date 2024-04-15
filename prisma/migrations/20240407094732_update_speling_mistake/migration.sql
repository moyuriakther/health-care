/*
  Warnings:

  - You are about to drop the column `dateOfBirsth` on the `patient-health-datas` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `patient-health-datas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patient-health-datas" DROP COLUMN "dateOfBirsth",
ADD COLUMN     "dateOfBirth" TEXT NOT NULL;
