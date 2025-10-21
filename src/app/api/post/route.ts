import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//post_tb 테이블에 데이터 조회
export async function GET() {
  try {
    const posts = await prisma.post_tb.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "글 목록을 가져올 수 없습니다." }, { status: 500 });
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