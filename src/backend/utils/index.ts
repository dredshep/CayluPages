import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Hello World");

  try {
    const business_hours = await prisma
      .business_hours.findMany();
    business_hours[0].id;
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}
main().then(() => {
  console.log("Done");
}).catch((error) => {
  console.error(error);
  prisma.$disconnect().then(() => {
    process.exit(1);
  });
});
