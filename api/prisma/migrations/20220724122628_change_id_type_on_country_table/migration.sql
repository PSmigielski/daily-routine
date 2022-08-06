/*
  Warnings:

  - The primary key for the `Country` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Country` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `countryId` on the `Timezone` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `countryId` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Timezone" DROP CONSTRAINT "Timezone_countryId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_countryId_fkey";

-- AlterTable
ALTER TABLE "Country" DROP CONSTRAINT "Country_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" CHAR(2) NOT NULL,
ADD CONSTRAINT "Country_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Timezone" DROP COLUMN "countryId",
ADD COLUMN     "countryId" CHAR(2) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "countryId",
ADD COLUMN     "countryId" CHAR(2) NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timezone" ADD CONSTRAINT "Timezone_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
