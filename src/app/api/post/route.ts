import { NextResponse } from "next/server";

export let posts: { id: string; title: string; content: string; author: string }[] = [];

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const { title, content, author } = await req.json();
  const id = Date.now().toString();
  posts.unshift({ id, title, content, author });
  return NextResponse.json({ id, title, content, author });
}