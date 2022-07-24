/*
  Warnings:

  - The primary key for the `Timezone` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Timezone` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_timezoneId_fkey";

-- DropIndex
DROP INDEX "Timezone_name_key";

-- AlterTable
ALTER TABLE "Timezone" DROP CONSTRAINT "Timezone_pkey",
DROP COLUMN "name",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "Timezone_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "timezoneId" SET DATA TYPE VARCHAR(100);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_timezoneId_fkey" FOREIGN KEY ("timezoneId") REFERENCES "Timezone"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
