import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Update task
export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    const url = new URL(req.url);
    const role = url.searchParams.get("role");   
    const userId = url.searchParams.get("userId");

    const body = await req.json();
    const data = {};

    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.completed !== undefined) data.completed = Boolean(body.completed);
    if (body.dueDate !== undefined) {
      data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    if (body.userId !== undefined) {
      data.userId = body.userId ?? null;
    }
    if (body.assignedToTeamId !== undefined) {
      data.assignedToTeamId = body.assignedToTeamId ?? null;
    }

  
    if (role === "employee") {
      if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
      }
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task || task.userId !== Number(userId)) {
        return NextResponse.json(
          { error: "Not allowed to update this task" },
          { status: 403 }
        );
      }
    }

    const updated = await prisma.task.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    const url = new URL(req.url);
    const role = url.searchParams.get("role");
    const userId = url.searchParams.get("userId");

    if (role === "employee") {
      if (!userId) {
        return NextResponse.json({ error: "userId required" }, { status: 400 });
      }
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task || task.userId !== Number(userId)) {
        return NextResponse.json(
          { error: "Not allowed to delete this task" },
          { status: 403 }
        );
      }
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
