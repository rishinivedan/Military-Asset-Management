import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const assets = await prisma.asset.findMany({
    include: { base: true },
  });
  return NextResponse.json(assets);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, type, baseId, quantity } = body;

  const newAsset = await prisma.asset.create({
    data: {
      name,
      type,
      quantity,
      base: {
        connect: { id: baseId },
      },
    },
  });

  return NextResponse.json(newAsset);
}
