import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bases = await prisma.base.findMany({
      include: { users: true, assets: true },
    });
    return NextResponse.json(bases);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch bases" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, location } = body;

    const newBase = await prisma.base.create({
      data: {
        name,
        location,
      },
    });

    return NextResponse.json(newBase);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create base" }, { status: 500 });
  }
}
