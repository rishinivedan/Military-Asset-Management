import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET /api/assignments/[id]
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: { asset: true },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Failed to fetch assignment:", error);
    return NextResponse.json({ error: "Failed to fetch assignment" }, { status: 500 });
  }
}

// PUT /api/assignments/[id]
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const { assetId, quantity, assignedTo, expended } = body;

    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data: {
        asset: { connect: { id: assetId } },
        quantity: Number(quantity), // 👈 this fixes the Prisma type error
        assignedTo,
        expended,
      },
    });

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error("Failed to update assignment:", error);
    return NextResponse.json({ error: "Failed to update assignment" }, { status: 500 });
  }
}

// DELETE /api/assignments/[id]
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.assignment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Failed to delete assignment:", error);
    return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 });
  }
}
