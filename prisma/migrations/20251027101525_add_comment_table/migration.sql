-- CreateTable
CREATE TABLE "public"."comment_tb" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "comment_tb_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."comment_tb" ADD CONSTRAINT "comment_tb_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user_tb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_tb" ADD CONSTRAINT "comment_tb_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."post_tb"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
