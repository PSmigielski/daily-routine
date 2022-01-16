-- CreateTable
CREATE TABLE "VerifyRequest" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "VerifyRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerifyRequest_userId_key" ON "VerifyRequest"("userId");

-- AddForeignKey
ALTER TABLE "VerifyRequest" ADD CONSTRAINT "VerifyRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
