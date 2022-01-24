/*
  Warnings:

  - You are about to drop the column `task_description` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `task_name` on the `Task` table. All the data in the column will be lost.
  - Added the required column `name` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "task_description",
DROP COLUMN "task_name",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" VARCHAR(255) NOT NULL;
