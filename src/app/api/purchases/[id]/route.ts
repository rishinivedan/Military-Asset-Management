import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET purchase by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const purchase = await prisma.purchase.findUnique({
    where: { id: params.id },
    include: { asset: true },
  });

  if (!purchase) {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }

  return NextResponse.json(purchase);
}

// PUT update purchase
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { assetId, quantity } = body;

  const updated = await prisma.purchase.update({
    where: { id: params.id },
    data: {
      asset: { connect: { id: assetId } },
      quantity,
    },
  });

  return NextResponse.json(updated);
}

// DELETE purchase
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.purchase.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Purchase deleted successfully" });
}
