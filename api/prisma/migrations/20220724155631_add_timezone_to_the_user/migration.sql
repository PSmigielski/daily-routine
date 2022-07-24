/*
  Warnings:

  - Added the required column `timezoneId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "timezoneId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_timezoneId_fkey" FOREIGN KEY ("timezoneId") REFERENCES "Timezone"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
