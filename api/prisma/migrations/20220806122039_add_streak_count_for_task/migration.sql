/*
  Warnings:

  - You are about to drop the column `intervalId` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "intervalId",
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;
