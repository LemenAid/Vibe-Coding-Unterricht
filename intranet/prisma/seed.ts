import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean up
  await prisma.timeEntry.deleteMany()
  await prisma.bulletinPost.deleteMany()
  await prisma.courseEvent.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.user.deleteMany()

  // 1. Admin / IT
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Adminowitsch',
      email: 'admin@cc-corp.de',
      role: 'admin',
    },
  })

  // 2. Dozent
  const doc = await prisma.user.create({
    data: {
      name: 'Dr. Prof. Code',
      email: 'doc@cc-corp.de',
      role: 'staff',
    },
  })

  // 3. Student 1 (Der Klassiker)
  const max = await prisma.user.create({
    data: {
      name: 'Max Mustermann',
      email: 'max@cc-student.de',
      role: 'student',
    },
  })

  // 4. Student 2 (Engagiert)
  const anna = await prisma.user.create({
    data: {
      name: 'Anna Fleißig',
      email: 'anna@cc-student.de',
      role: 'student',
    },
  })

  // 5. Verwaltung / Sekretariat
  const office = await prisma.user.create({
    data: {
      name: 'Susi Sorglos',
      email: 'office@cc-corp.de',
      role: 'admin',
    },
  })

  console.log('Users created: Admin, Doc, Max, Anna, Susi')

  // Create Announcements
  await prisma.announcement.create({
    data: {
      title: 'Willkommen im neuen Intranet 2.0!',
      content: 'Jetzt mit Login und echten Usern. Viel Spaß beim Testen.',
      author: 'Admin Adminowitsch',
    }
  })
  
  await prisma.announcement.create({
    data: {
      title: 'Kaffeemaschine defekt',
      content: 'Die Maschine im 2. Stock wird morgen repariert.',
      author: 'Susi Sorglos',
    }
  })

  // Create Courses
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  
  await prisma.courseEvent.create({
    data: {
      title: 'Advanced React Patterns',
      description: 'Deep Dive in Server Components',
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000), 
      location: 'Raum 404',
      instructor: 'Dr. Prof. Code',
    }
  })

  // Create Bulletin Posts
  await prisma.bulletinPost.create({
    data: {
      title: 'Suche Lerngruppe für React',
      description: 'Wer hat Lust sich 2x die Woche zu treffen?',
      type: 'SEARCH',
      contactInfo: 'Slack: @max',
      userId: max.id
    }
  })
  
   await prisma.bulletinPost.create({
    data: {
      title: 'Nachhilfe Statistik',
      description: 'Ich biete Statistik-Nachhilfe für Erstis.',
      type: 'OFFER',
      contactInfo: 'anna@cc-student.de',
      userId: anna.id
    }
  })

  // Create Exams
  await prisma.exam.create({
    data: {
      title: 'Web Development Abschlussprüfung',
      date: new Date(tomorrow.getTime() + 7 * 24 * 60 * 60 * 1000), // In 1 week
      content: 'HTML, CSS, React, Next.js, Prisma',
      location: 'Hörsaal 1',
      duration: 90
    }
  })

  await prisma.exam.create({
    data: {
      title: 'Datenbanken I',
      date: new Date(tomorrow.getTime() + 14 * 24 * 60 * 60 * 1000), // In 2 weeks
      content: 'SQL, Normalisierung, ER-Diagramme',
      location: 'Raum 202',
      duration: 60
    }
  })

  await prisma.exam.create({
    data: {
      title: 'Statistik Klausur',
      date: new Date(tomorrow.getTime() + 20 * 24 * 60 * 60 * 1000), // In 3 weeks
      content: 'Wahrscheinlichkeitsrechnung, Verteilungen',
      location: 'Hörsaal 2',
      duration: 120
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
