/*
  Warnings:

  - Added the required column `type` to the `CarPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('FRONT', 'LEFT', 'RIGHT', 'REAR', 'SALON_FRONT', 'SALON_REAR', 'UNDER_HOOD');

-- AlterTable
ALTER TABLE "CarPhoto" ADD COLUMN     "type" "PhotoType" NOT NULL;
