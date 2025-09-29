import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();

  // 실제 들어오는 데이터 구조 확인
  console.log(JSON.stringify(body, null, 2));

  // Clerk에서 오는 user.created 이벤트 데이터 예시
  const { id, email_addresses, first_name, last_name } = body.data;

  await prisma.user.create({
    data: {
      clerkId: id,
      email: email_addresses?.[0]?.email_address ?? "",
      name: [first_name, last_name].filter(Boolean).join(" "),
    },
  });

  return NextResponse.json({ ok: true });
}