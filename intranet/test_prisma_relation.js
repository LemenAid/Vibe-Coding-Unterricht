
const { PrismaClient } = require('./generated-client');
const prisma = new PrismaClient();

async function main() {
  console.log("Testing Prisma Client Exam relation...");
  try {
    // Try to query exams including the course relation
    const exams = await prisma.exam.findMany({
      take: 1,
      include: {
        course: true
      }
    });
    console.log("Query successful!");
    console.log("Exams found:", exams.length);
    if (exams.length > 0) {
        console.log("Sample exam course:", exams[0].course);
    }
  } catch (e) {
    console.error("Query failed:");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
