import { NextResponse } from "next/server";

// posts 배열을 임시로 가져오는 방법 (실제 서비스에서는 DB 사용)
import { posts } from "../route";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const post = posts.find((p) => p.id === params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}