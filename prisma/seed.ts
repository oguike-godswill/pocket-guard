import { PrismaClient } from "@prisma/client";
import { EXPENSE_CATEGORIES } from "../src/lib/categories";

const prisma = new PrismaClient();

async function main() {
  for (const category of EXPENSE_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { kind: category.kind },
      create: {
        name: category.name,
        kind: category.kind,
      },
    });
  }
  console.log("Seeded default categories");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
