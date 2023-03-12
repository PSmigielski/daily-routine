/*
  Warnings:

  - You are about to drop the column `subscriptionData` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `endpoint` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expirationTime` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keys` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "subscriptionData",
ADD COLUMN     "endpoint" VARCHAR(255) NOT NULL,
ADD COLUMN     "expirationTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "keys" JSONB NOT NULL;
