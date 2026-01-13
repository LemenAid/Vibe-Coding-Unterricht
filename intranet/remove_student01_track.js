const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Removing Track for Student 01...");

  // Find Student 01 by name (updated in previous step)
  const student = await prisma.user.findFirst({
      where: { name: "Student 01" }
  });

  if (student) {
      await prisma.user.update({
          where: { id: student.id },
          data: { educationTrackId: null }
      });
      console.log("Track removed for Student 01.");
  } else {
      console.log("Student 01 not found.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
