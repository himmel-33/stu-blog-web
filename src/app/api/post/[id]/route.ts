import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post_tb.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "글을 가져올 수 없습니다." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { title, content, imageUrl, userId, category } = await req.json();

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
      category: category || "일반", // 기본값 설정
      userId: user.id,
    },
  });

  return NextResponse.json(post);
}