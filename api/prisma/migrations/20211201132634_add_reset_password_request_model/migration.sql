-- CreateTable
CREATE TABLE "ResetPasswordRequest" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "ResetPasswordRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResetPasswordRequest_userId_key" ON "ResetPasswordRequest"("userId");

-- AddForeignKey
ALTER TABLE "ResetPasswordRequest" ADD CONSTRAINT "ResetPasswordRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
