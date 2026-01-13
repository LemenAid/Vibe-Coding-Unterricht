import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const emailToDelete = 'admin@cc-portal.com';
  console.log(`Deleting user: ${emailToDelete}...`);

  try {
    const user = await prisma.user.findUnique({
      where: { email: emailToDelete }
    });

    if (user) {
        // Delete related data first if necessary (though Cascade usually handles it)
        // Prisma schema usually handles cascade if configured, but let's just try delete.
        await prisma.user.delete({
            where: { email: emailToDelete }
        });
        console.log(`User ${emailToDelete} deleted.`);
    } else {
        console.log(`User ${emailToDelete} not found.`);
    }

  } catch (e) {
    console.error("Error deleting user:", e);
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
