import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // 1. Get or Create Users for Roles
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cc-portal.com' },
    update: {},
    create: {
      email: 'admin@cc-portal.com',
      name: 'Dr. Maria Verwaltung',
      role: 'admin',
      department: 'Schulleitung',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'lehrer@cc-portal.com' },
    update: {},
    create: {
      email: 'lehrer@cc-portal.com',
      name: 'Herr Müller (Dozent)',
      role: 'teacher',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'schueler@cc-portal.com' },
    update: {},
    create: {
      email: 'schueler@cc-portal.com',
      name: 'Max Mustermann',
      role: 'student',
    },
  });

  console.log('Users ensured.');

  // 2. Bulletin Board Entries (Schwarzes Brett)
  // Admin Entry
  await prisma.bulletinPost.create({
    data: {
      title: 'Wartungsarbeiten am Server',
      description: 'Am kommenden Samstag finden zwischen 08:00 und 12:00 Uhr Wartungsarbeiten statt. Das Portal wird kurzzeitig nicht erreichbar sein.',
      type: 'ANNOUNCEMENT',
      contactInfo: 'it-support@cc-portal.com',
      userId: admin.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
    },
  });

  // Teacher Entry
  await prisma.bulletinPost.create({
    data: {
      title: 'Zusatzmaterial "React Hooks"',
      description: 'Ich habe neue Übungsaufgaben zu useEffect und useMemo hochgeladen. Bitte bis Montag anschauen!',
      type: 'INFO',
      contactInfo: 'm.mueller@cc-portal.com',
      userId: teacher.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    },
  });

  // Student Entry
  await prisma.bulletinPost.create({
    data: {
      title: 'Lernpartner für TypeScript gesucht',
      description: 'Hallo zusammen, ich suche jemanden, der Lust hat, gemeinsam für die kommende TypeScript-Prüfung zu lernen. Gerne auch Remote.',
      type: 'SOCIAL',
      contactInfo: 'Max (Discord: max#1234)',
      userId: student.id,
      createdAt: new Date(), // Just now
    },
  });

  console.log('Bulletin posts created.');

  // 3. Inquiries (Anfragen/History)
  // Student -> Admin (Subject Change)
  await prisma.inquiry.create({
    data: {
      subject: 'Antrag auf Wechsel des Bildungsträgers',
      message: 'Sehr geehrte Frau Verwaltung, ist es möglich, meine Maßnahmenummer für den Bildungsgutschein zu ändern? Ich habe Post vom Amt erhalten.',
      category: 'ADMIN',
      status: 'OPEN',
      userId: student.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    },
  });

  // Student -> Teacher (Code Question)
  await prisma.inquiry.create({
    data: {
      subject: 'Verständnisfrage: Props Drilling',
      message: 'Hallo Herr Müller, ich verstehe noch nicht ganz, wann man Context API nutzen sollte und wann Props Drilling okay ist. Können wir das kurz besprechen?',
      category: 'TEACHER',
      recipientId: teacher.id,
      status: 'ANSWERED',
      answer: 'Hallo Max, das ist eine gute Frage. Als Faustregel: Wenn du Props durch mehr als 3 Komponenten durchreichst, die sie nicht brauchen, nimm Context. Wir schauen uns das morgen im Call an.',
      answeredAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      userId: student.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  });
  
  // Create notification for answer
  await prisma.notification.create({
      data: {
          userId: student.id,
          message: `Deine Anfrage "Verständnisfrage: Props Drilling" wurde beantwortet.`,
          link: '/inquiries',
          isRead: false
      }
  });

  // Teacher -> Admin (Room Booking)
  await prisma.inquiry.create({
    data: {
      subject: 'Raumbelegung Prüfungswoche',
      message: 'Ich benötige für die Abschlussprüfung am 25.04. den großen Seminarraum (Raum 104). Ist dieser noch frei?',
      category: 'ADMIN',
      status: 'OPEN',
      userId: teacher.id,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
  });

  console.log('Inquiries created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
