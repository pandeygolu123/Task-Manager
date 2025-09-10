
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("GET /api/users Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
