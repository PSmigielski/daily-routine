/*
  Warnings:

  - You are about to drop the column `IntervalId` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "IntervalId",
ADD COLUMN     "intervalId" INTEGER;
