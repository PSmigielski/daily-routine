/*
  Warnings:

  - You are about to drop the column `timezone` on the `Country` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Country" DROP COLUMN "timezone";

-- CreateTable
CREATE TABLE "Timezone" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "gmtOffset" INTEGER NOT NULL,
    "countryId" UUID NOT NULL,

    CONSTRAINT "Timezone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Timezone_name_key" ON "Timezone"("name");

-- AddForeignKey
ALTER TABLE "Timezone" ADD CONSTRAINT "Timezone_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
