-- DropForeignKey
ALTER TABLE "Timezone" DROP CONSTRAINT "Timezone_countryId_fkey";

-- AddForeignKey
ALTER TABLE "Timezone" ADD CONSTRAINT "Timezone_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
