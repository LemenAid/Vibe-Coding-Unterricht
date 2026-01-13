"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

// Time Tracking
export async function getLastTimeEntry() {
  const user = await getCurrentUser();
  if (!user) return null;

  return prisma.timeEntry.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function clockIn(formData?: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const location = formData ? (formData.get('location') as string) : 'ON_SITE';

  await prisma.timeEntry.create({
    data: {
      userId: user.id,
      clockIn: new Date(),
      location: location
    },
  });
  revalidatePath('/');
  revalidatePath('/time');
}

export async function clockOut(entryId: string) {
  // Optional: Check if entry belongs to user
  await prisma.timeEntry.update({
    where: { id: entryId },
    data: {
      clockOut: new Date(),
    },
  });
  revalidatePath('/');
  revalidatePath('/time');
}

export async function getRecentEntries() {
    const user = await getCurrentUser();
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
    include: {
        user: {
            select: { name: true, email: true }
        }
    }
  });
}

export async function createBulletinPost(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

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
      userId: user.id
    },
  });
  revalidatePath('/bulletin');
}

// Announcements
export async function getAnnouncements() {
    return prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3
    })
}

export async function createAnnouncement(formData: FormData) {
    const user = await getCurrentUser();
    if (!user || user.role === 'student') throw new Error("Unauthorized");
  
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
  
    await prisma.announcement.create({
      data: {
        title,
        content,
        author: user.name,
      },
    });
    revalidatePath('/');
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
        take: 5,
        include: { room: true }
    })
}

export async function getAllCourseEvents() {
  return prisma.courseEvent.findMany({
      orderBy: { startTime: 'asc' },
      include: { room: true }
  })
}

// Exams
export async function getExams() {
    return prisma.exam.findMany({
        orderBy: { date: 'asc' },
        where: {
            date: {
                gte: new Date()
            }
        },
        take: 3
    })
}

// Inquiries
export async function createInquiry(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");
  
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const category = formData.get('category') as string;
  
    await prisma.inquiry.create({
      data: {
        subject,
        message,
        category,
        userId: user.id
      },
    });
    revalidatePath('/'); 
    revalidatePath('/inquiries');
}

export async function getUserInquiries() {
    const user = await getCurrentUser();
    if (!user) return [];

    return prisma.inquiry.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getResolvedInquiriesForStaff() {
    const user = await getCurrentUser();
    if (!user || user.role === 'student') return [];

    const category = user.role === 'admin' ? 'ADMIN' : 'TEACHER';

    return prisma.inquiry.findMany({
        where: { 
            category: category,
            status: 'ANSWERED'
        },
        orderBy: { answeredAt: 'desc' },
        include: {
            user: {
                select: { name: true, email: true }
            }
        }
    });
}

export async function getOpenInquiries() {
    const user = await getCurrentUser();
    if (!user || user.role === 'student') return [];

    // Admins sehen ADMIN Anfragen, Staff sieht TEACHER Anfragen
    const category = user.role === 'admin' ? 'ADMIN' : 'TEACHER';

    return prisma.inquiry.findMany({
        where: {
            category: category,
            status: 'OPEN'
        },
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: { name: true, email: true } // Wer hat gefragt?
            }
        }
    });
}

export async function resolveInquiry(formData: FormData) {
    const user = await getCurrentUser();
    if (!user || user.role === 'student') throw new Error("Unauthorized");

    const inquiryId = formData.get('inquiryId') as string;
    const answer = formData.get('answer') as string;

    await prisma.inquiry.update({
        where: { id: inquiryId },
        data: { 
            status: 'ANSWERED',
            answer: answer,
            answeredAt: new Date()
        }
    });
    revalidatePath('/');
    revalidatePath('/inquiries');
}

// Profil & Stats Actions

export async function getStudentData() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'student') return null;

    // Noten abrufen
    const grades = await prisma.grade.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' }
    });

    // Anwesenheit (Mock-Logic basierend auf TimeEntries oder Random für MVP)
    // Wir nehmen echte TimeEntries als Basis für "Anwesenheitstage"
    const attendanceCount = await prisma.timeEntry.count({
        where: { userId: user.id }
    });

    return {
        grades,
        attendanceStats: {
            totalDays: attendanceCount,
            attendanceRate: 92, // Mockwert in Prozent
            missingDays: 3      // Mockwert
        }
    };
}

export async function getTeacherData() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'staff') return null; // 'staff' ist hier Teacher/Mitarbeiter

    const skills = await prisma.teacherSkill.findMany({
        where: { userId: user.id }
    });

    return { skills };
}

export async function getAdminData() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') return null;

    // Arbeitszeit berechnen (Summe aller TimeEntries des Users)
    const timeEntries = await prisma.timeEntry.findMany({
        where: { userId: user.id },
        select: { duration: true, clockIn: true }
    });

    // Aggregation (in echten Apps besser in DB machen, hier in JS für MVP)
    const totalMinutes = timeEntries.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const totalHours = Math.round(totalMinutes / 60);

    return {
        department: user.department || "Allgemeine Verwaltung",
        workStats: {
            totalHours,
            entriesCount: timeEntries.length
        }
    };
}
