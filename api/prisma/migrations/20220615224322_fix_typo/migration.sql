/*
  Warnings:

  - You are about to drop the column `lastRepetation` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "lastRepetation",
ADD COLUMN     "lastRepetition" TIMESTAMP(3);
