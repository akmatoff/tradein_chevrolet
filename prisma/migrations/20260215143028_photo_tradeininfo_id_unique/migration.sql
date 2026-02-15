/*
  Warnings:

  - A unique constraint covering the columns `[tradeinInfoId]` on the table `CarPhoto` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CarPhoto_tradeinInfoId_key" ON "CarPhoto"("tradeinInfoId");
