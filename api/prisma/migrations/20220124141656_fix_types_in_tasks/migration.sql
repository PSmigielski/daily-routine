/*
  Warnings:

  - Made the column `hasSubtasks` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "completedAt" DROP NOT NULL,
ALTER COLUMN "hasSubtasks" SET NOT NULL;
