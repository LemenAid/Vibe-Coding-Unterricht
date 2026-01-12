import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Time Tracking
export async function getLastTimeEntry() {
  // Für MVP: Hardcoded User-ID (erster User in DB)
  const user = await prisma.user.findFirst();
  if (!user) return null;

  return prisma.timeEntry.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function clockIn() {
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("No user found");

  await prisma.timeEntry.create({
    data: {
      userId: user.id,
      clockIn: new Date(),
    },
  });
  revalidatePath('/');
}

export async function clockOut(entryId: string) {
  await prisma.timeEntry.update({
    where: { id: entryId },
    data: {
      clockOut: new Date(),
    },
  });
  revalidatePath('/');
}

export async function getRecentEntries() {
    const user = await prisma.user.findFirst();
    if (!user) return [];
    
    return prisma.timeEntry.findMany({
        where: { userId: user.id },
        orderBy: { clockIn: 'desc' },
        take: 5
    });
}

// Bulletin Board
export async function getBulletinPosts() {
  return prisma.bulletinPost.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function createBulletinPost(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const type = formData.get('type') as string;
  const contactInfo = formData.get('contactInfo') as string;

  await prisma.bulletinPost.create({
    data: {
      title,
      description,
      type,
      contactInfo,
    },
  });
  revalidatePath('/');
}

// Announcements
export async function getAnnouncements() {
    return prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3
    })
}

// Course Schedule
export async function getCourseEvents() {
    return prisma.courseEvent.findMany({
        orderBy: { startTime: 'asc' },
        where: {
            startTime: {
                gte: new Date()
            }
        },
        take: 5
    })
}

export async function getAllCourseEvents() {
  return prisma.courseEvent.findMany({
      orderBy: { startTime: 'asc' },
  })
}
