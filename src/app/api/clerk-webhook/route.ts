import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();

  // 안전하게 구조 분해
  const user = body.data;
  const email = user.email_addresses?.[0]?.email_address ?? "";
  const clerkId = user.id;
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");

  // Clerk Webhook 전체 데이터 구조 확인
  console.log(JSON.stringify(body, null, 2));

  // 필수값 체크
  if (!clerkId || !email) {
    console.error("필수값 누락:", { clerkId, email });
    return NextResponse.json({ error: "필수값 누락" }, { status: 400 });
  }

  try {
    await prisma.user_tb.create({
      data: {
        clerkId,
        email,
        name,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Prisma Error:", error);
    return NextResponse.json({ error: "DB 저장 실패" }, { status: 500 });
  }
}