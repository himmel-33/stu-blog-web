import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const user = body.data;
  const email = user.email_addresses?.[0]?.email_address ?? "";
  const clerkId = user.id;
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const phone = user.phone_numbers?.[0]?.phone_number ?? null; // Clerk phone 번호

  if (!clerkId || !email) {
    return NextResponse.json({ error: "필수값 누락" }, { status: 400 });
  }

  try {
    if (body.type === "user.created") {
      await prisma.user_tb.create({
        data: {
          clerkId,
          email,
          name,
          phone, // phone 저장
        },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "DB 저장 실패" }, { status: 500 });
  }
}