import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET /api/assignments - get all assignments with asset details
export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        asset: true,
      },
    });
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Failed to fetch assignments:", error);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}

// POST /api/assignments - create a new assignment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assetId, quantity, assignedTo, expended } = body;

    const newAssignment = await prisma.assignment.create({
      data: {
        asset: { connect: { id: assetId } },
        quantity,
        assignedTo,
        expended: expended ?? false,
      },
    });

    return NextResponse.json(newAssignment);
  } catch (error) {
    console.error("Failed to create assignment:", error);
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}
