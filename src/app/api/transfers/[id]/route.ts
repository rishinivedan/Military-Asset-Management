import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET /api/transfers/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const transfer = await prisma.transfer.findUnique({
      where: { id: params.id },
      include: {
        asset: true,
        fromBase: true,
        toBase: true,
      },
    });

    if (!transfer) {
      return NextResponse.json({ error: "Transfer not found" }, { status: 404 });
    }

    return NextResponse.json(transfer);
  } catch (error) {
    console.error("Failed to fetch transfer:", error);
    return NextResponse.json({ error: "Failed to fetch transfer" }, { status: 500 });
  }
}

// PUT /api/transfers/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { assetId, fromBaseId, toBaseId, quantity } = body;

    // Validation
    if (!assetId || !fromBaseId || !toBaseId || quantity === undefined) {
      return NextResponse.json(
        { error: "All fields (assetId, fromBaseId, toBaseId, quantity) are required." },
        { status: 400 }
      );
    }

    const quantityNum = Number(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return NextResponse.json({ error: "Quantity must be a positive number." }, { status: 400 });
    }

    const updatedTransfer = await prisma.transfer.update({
      where: { id: params.id },
      data: {
        asset: { connect: { id: assetId } },
        fromBase: { connect: { id: fromBaseId } },
        toBase: { connect: { id: toBaseId } },
        quantity: quantityNum,
      },
    });

    return NextResponse.json(updatedTransfer);
  } catch (error) {
    console.error("Failed to update transfer:", error);
    return NextResponse.json({ error: "Failed to update transfer" }, { status: 500 });
  }
}

// DELETE /api/transfers/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.transfer.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Transfer deleted successfully" });
  } catch (error) {
    console.error("Failed to delete transfer:", error);
    return NextResponse.json({ error: "Failed to delete transfer" }, { status: 500 });
  }
}
