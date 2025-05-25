import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const base = await prisma.base.findUnique({
      where: { id: params.id },
      include: { users: true, assets: true },
    });

    if (!base) {
      return NextResponse.json({ error: "Base not found" }, { status: 404 });
    }

    return NextResponse.json(base);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch base" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, location } = body;

    const updated = await prisma.base.update({
      where: { id: params.id },
      data: { name, location },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update base" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.base.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Base deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete base" }, { status: 500 });
  }
}
