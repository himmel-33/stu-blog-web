import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 댓글 삭제
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

    // 댓글이 존재하는지 확인
    const comment = await prisma.comment_tb.findUnique({
      where: { id: params.id },
    });

    if (!comment) {
      return NextResponse.json({ error: "댓글을 찾을 수 없습니다." }, { status: 404 });
    }

    // 자신의 댓글인지 확인
    if (comment.userId !== user.id) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    await prisma.comment_tb.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return NextResponse.json({ error: "댓글 삭제에 실패했습니다." }, { status: 500 });
  }
}

