import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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

// 글 수정
export async function PUT(
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

    // 글이 존재하는지 확인
    const existingPost = await prisma.post_tb.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
    }

    // 자신의 글인지 확인
    if (existingPost.userId !== user.id) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const { title, content, category } = await req.json();

    const updatedPost = await prisma.post_tb.update({
      where: { id: params.id },
      data: {
        title,
        content,
        category,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json({ error: "글을 수정할 수 없습니다." }, { status: 500 });
  }
}

// 글 삭제
export async function DELETE(
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

    // 글이 존재하는지 확인
    const existingPost = await prisma.post_tb.findUnique({
      where: { id: params.id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
    }

    // 자신의 글인지 확인
    if (existingPost.userId !== user.id) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    await prisma.post_tb.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "글이 삭제되었습니다." });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json({ error: "글을 삭제할 수 없습니다." }, { status: 500 });
  }
}