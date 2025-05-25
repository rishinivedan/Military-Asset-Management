const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Step 1: Create a base
  const alphaBase = await prisma.base.create({
    data: {
      name: "Alpha",
      location: "Sector 7G",
    },
  });

  // Step 2: Create an asset linked to that base
  await prisma.asset.create({
    data: {
      name: "Rifle",
      type: "Weapon",
      quantity: 100,
      base: {
        connect: {
          id: alphaBase.id,
        },
      },
    },
  });

  console.log("✅ Seed data inserted");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
