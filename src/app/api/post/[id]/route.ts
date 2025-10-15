import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { title, content, imageUrl, userId } = await req.json();

  // userId는 Clerk의 user.id(clerkId)임
  const user = await prisma.user_tb.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: "유저를 찾을 수 없습니다." }, { status: 400 });
  }

  const post = await prisma.post_tb.create({
    data: {
      title,
      content,
      imageUrl,
      userId: user.id,
    },
  });

  return NextResponse.json(post);
}