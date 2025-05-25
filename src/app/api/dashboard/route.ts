import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const base = searchParams.get('base');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const assets = await prisma.asset.findMany({
      where: {
        ...(base ? { base: { name: base } } : {}),
        ...(type ? { type } : {}),
      },
      include: {
        base: true,
        purchases: {
          where: {
            ...(startDate || endDate
              ? {
                  date: {
                    ...(startDate ? { gte: new Date(startDate) } : {}),
                    ...(endDate ? { lte: new Date(endDate) } : {}),
                  },
                }
              : {}),
          },
        },
        assignments: true,
        transfers: {
          where: {
            ...(startDate || endDate
              ? {
                  date: {
                    ...(startDate ? { gte: new Date(startDate) } : {}),
                    ...(endDate ? { lte: new Date(endDate) } : {}),
                  },
                }
              : {}),
          },
        },
      },
    });

    const data = assets.map((asset) => {
      const purchases = asset.purchases.reduce((sum, p) => sum + p.quantity, 0);
      const assignedQty = asset.assignments.reduce((sum, a) => sum + a.quantity, 0);
      const expendedQty = asset.assignments
        .filter((a) => a.expended)
        .reduce((sum, a) => sum + a.quantity, 0);

      const transferIn = asset.transfers
        .filter((t) => t.toBaseId === asset.baseId)
        .reduce((sum, t) => sum + t.quantity, 0);

      const transferOut = asset.transfers
        .filter((t) => t.fromBaseId === asset.baseId)
        .reduce((sum, t) => sum + t.quantity, 0);

      const netMovement = purchases + transferIn - transferOut;
      const openingBalance = asset.quantity - netMovement;
      const closingBalance = asset.quantity;

      return {
        assetId: asset.id,
        assetName: asset.name,
        baseName: asset.base.name,
        type: asset.type,
        openingBalance,
        closingBalance,
        netMovement,
        assignedQty,
        expendedQty,
        movementBreakdown: {
          purchases,
          transferIn,
          transferOut,
        },
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return new NextResponse('Failed to load dashboard data', { status: 500 });
  }
}
