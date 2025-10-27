import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 사용자의 글 목록 조회
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const user = await prisma.user_tb.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "유저를 찾을 수 없습니다." }, { status: 404 });
    }

    const posts = await prisma.post_tb.findMany({
      where: { userId: user.id },
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
    console.error("Failed to fetch user posts:", error);
    return NextResponse.json({ error: "글 목록을 가져올 수 없습니다." }, { status: 500 });
  }
}

