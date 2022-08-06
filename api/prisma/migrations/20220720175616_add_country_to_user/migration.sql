/*
  Warnings:

  - Added the required column `countryId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "countryId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Country" (
    "id" UUID NOT NULL,
    "name" VARCHAR(56) NOT NULL,
    "timezone" INTEGER NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
