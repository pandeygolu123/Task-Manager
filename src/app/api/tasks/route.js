import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const role = url.searchParams.get("role");   
    const userId = url.searchParams.get("userId"); 

    let where = {};

    if (role === "employee" && userId) {
      where.userId = Number(userId);
    }

    

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, description, dueDate, userId } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: userId ?? null,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
