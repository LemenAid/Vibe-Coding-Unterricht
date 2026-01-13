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
        // Manually delete related records that restrict deletion
        
        // 1. Delete BulletinPosts
        await prisma.bulletinPost.deleteMany({
            where: { userId: user.id }
        });
        
        // 2. Delete Notifications
        await prisma.notification.deleteMany({
            where: { userId: user.id }
        });

        // 3. Delete Inquiries (sent and received)
        await prisma.inquiry.deleteMany({
            where: { 
                OR: [
                    { userId: user.id },
                    { recipientId: user.id }
                ]
             }
        });
        
        // 4. Delete TimeEntries
         await prisma.timeEntry.deleteMany({
            where: { userId: user.id }
        });

        // 5. Delete from Course (Teachers) - Relation
        // This is a many-to-many, so we disconnect
        // But in Prisma delete usually handles cascade for implicit m:n if configured, but here it failed.
        // It might be explicit relations or other things.
        
        // Actually, let's just delete the User and see if cleaning the above helps.
        // If "Course" or "EducationTrack" refers to User, we might need to check those.
        
        // Check if user is author of Announcement (string based) - no FK constraint there.
        
        // Try delete again
        await prisma.user.delete({
            where: { id: user.id }
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
