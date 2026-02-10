/*
  Warnings:

  - Changed the type of `bodyType` on the `TradeinInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('SEDAN', 'HATCHBACK', 'UNIVERSAL', 'COUPE', 'SUV', 'CROSSOVER', 'MINIVAN');

-- AlterTable
ALTER TABLE "TradeinInfo" DROP COLUMN "bodyType",
ADD COLUMN     "bodyType" "BodyType" NOT NULL;
