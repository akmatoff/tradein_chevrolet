-- CreateEnum
CREATE TYPE "EngineType" AS ENUM ('PETROL', 'DIESEL', 'GAS', 'HYBRID', 'PETROL_GAS');

-- CreateEnum
CREATE TYPE "TransmissionType" AS ENUM ('AUTOMATIC', 'MECHANIC', 'ROBOTIC');

-- CreateEnum
CREATE TYPE "DriveType" AS ENUM ('FRONT', 'REAR', 'FULL');

-- CreateEnum
CREATE TYPE "SteeringWheelSide" AS ENUM ('LEFT', 'RIGHT');

-- CreateTable
CREATE TABLE "TradeinInfo" (
    "id" SERIAL NOT NULL,
    "manager" TEXT NOT NULL,
    "carBrand" TEXT NOT NULL,
    "carModel" TEXT NOT NULL,
    "productionYear" INTEGER NOT NULL,
    "engineVolume" DOUBLE PRECISION NOT NULL,
    "engineType" "EngineType" NOT NULL,
    "transmission" "TransmissionType" NOT NULL,
    "drive" "DriveType" NOT NULL,
    "mileage" INTEGER NOT NULL,
    "bodyType" TEXT NOT NULL,
    "steeringWheelSide" "SteeringWheelSide" NOT NULL,
    "vinCode" VARCHAR(17) NOT NULL,
    "carCondition" TEXT NOT NULL,
    "hasRestrictions" BOOLEAN NOT NULL,
    "comment" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TradeinInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarPhoto" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "tradeinInfoId" INTEGER NOT NULL,

    CONSTRAINT "CarPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CarPhoto" ADD CONSTRAINT "CarPhoto_tradeinInfoId_fkey" FOREIGN KEY ("tradeinInfoId") REFERENCES "TradeinInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
