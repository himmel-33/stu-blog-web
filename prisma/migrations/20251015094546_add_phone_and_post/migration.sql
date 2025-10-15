-- AlterTable
ALTER TABLE "public"."user_tb" ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "public"."post_tb" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "post_tb_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."post_tb" ADD CONSTRAINT "post_tb_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user_tb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
