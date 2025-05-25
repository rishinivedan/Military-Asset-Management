import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET /api/transfers - list all transfers with asset and base details
export async function GET() {
  try {
    const transfers = await prisma.transfer.findMany({
      include: {
        asset: true,
        fromBase: true,
        toBase: true,
      },
    });
    return NextResponse.json(transfers);
  } catch (error) {
    console.error("Failed to fetch transfers:", error);
    return NextResponse.json({ error: "Failed to fetch transfers" }, { status: 500 });
  }
}

// POST /api/transfers - create a new transfer
export async function POST(request: Request) {
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

    const newTransfer = await prisma.transfer.create({
      data: {
        asset: { connect: { id: assetId } },
        fromBase: { connect: { id: fromBaseId } },
        toBase: { connect: { id: toBaseId } },
        quantity: quantityNum,
      },
    });

    return NextResponse.json(newTransfer);
  } catch (error) {
    console.error("Failed to create transfer:", error);
    return NextResponse.json({ error: "Failed to create transfer" }, { status: 500 });
  }
}
