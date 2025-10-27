import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 게시글의 댓글 목록 조회
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment_tb.findMany({
      where: { postId: params.id },
      include: {
        user: {
          select: {
            name: true,
            clerkId: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json({ error: "댓글을 가져올 수 없습니다." }, { status: 500 });
  }
}

// 댓글 작성
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const user = await prisma.user_tb.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "유저를 찾을 수 없습니다." }, { status: 404 });
    }

    // 게시글이 존재하는지 확인
    const post = await prisma.post_tb.findUnique({ where: { id: params.id } });
    if (!post) {
      return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
    }

    const { content } = await req.json();
    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "댓글 내용을 입력해주세요." }, { status: 400 });
    }

    const comment = await prisma.comment_tb.create({
      data: {
        content,
        userId: user.id,
        postId: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            clerkId: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Failed to create comment:", error);
    return NextResponse.json({ error: "댓글 작성에 실패했습니다." }, { status: 500 });
  }
}

