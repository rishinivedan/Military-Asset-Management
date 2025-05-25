import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET all purchases
export async function GET() {
  const purchases = await prisma.purchase.findMany({
    include: { asset: true },
  });
  return NextResponse.json(purchases);
}

// POST create a purchase
export async function POST(request: Request) {
  const body = await request.json();
  const { assetId, quantity } = body;

  const newPurchase = await prisma.purchase.create({
    data: {
      asset: { connect: { id: assetId } },
      quantity,
    },
  });

  return NextResponse.json(newPurchase);
}
