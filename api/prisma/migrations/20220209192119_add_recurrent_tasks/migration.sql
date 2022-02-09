-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "lastRepetation" TIMESTAMP(3),
ADD COLUMN     "repeatEvery" INTEGER NOT NULL DEFAULT 0;
