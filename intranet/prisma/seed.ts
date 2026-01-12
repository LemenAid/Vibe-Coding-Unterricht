import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean up
  await prisma.timeEntry.deleteMany()
  await prisma.bulletinPost.deleteMany()
  await prisma.courseEvent.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.user.deleteMany()

  // Create User
  const user = await prisma.user.create({
    data: {
      name: 'Max Mustermann',
      email: 'max@cc-student.de',
      role: 'student',
    },
  })

  console.log('Created User:', user.name)

  // Create Announcements
  await prisma.announcement.create({
    data: {
      title: 'Willkommen im neuen Intranet!',
      content: 'Wir freuen uns, euch das neue Vibe-Portal vorzustellen. Alles läuft jetzt schneller und schöner.',
      author: 'Admin Team',
    }
  })
  
  await prisma.announcement.create({
    data: {
      title: 'Wartungsarbeiten am Wochenende',
      content: 'Am Samstag werden die Server kurz neu gestartet.',
      author: 'IT Support',
    }
  })

  // Create Courses
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  
  await prisma.courseEvent.create({
    data: {
      title: 'Web Development Basics',
      description: 'Einführung in HTML & CSS',
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000), // +4 hours
      location: 'Raum 304',
      instructor: 'Dr. Code',
    }
  })

  // Create Bulletin Posts
  await prisma.bulletinPost.create({
    data: {
      title: 'Suche Lerngruppe für React',
      description: 'Wer hat Lust sich 2x die Woche zu treffen?',
      type: 'SEARCH',
      contactInfo: 'Slack: @max',
      userId: user.id
    }
  })
  
   await prisma.bulletinPost.create({
    data: {
      title: 'Biete alte Fachbücher',
      description: 'Clean Code, Pragmatic Programmer zu verschenken',
      type: 'OFFER',
      contactInfo: 'Am Empfang melden',
    }
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
