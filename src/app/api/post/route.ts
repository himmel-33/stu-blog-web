import { NextResponse } from "next/server";

let posts: { id: string; title: string; content: string }[] = [];

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const { title, content } = await req.json();
  const id = Date.now().toString();
  posts.unshift({ id, title, content });
  return NextResponse.json({ id, title, content });
}