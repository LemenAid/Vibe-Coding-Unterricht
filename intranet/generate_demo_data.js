
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start generating demo content...');

  // 1. Fetch Users by Role
  const student = await prisma.user.findFirst({ where: { role: 'student' } });
  const teacher = await prisma.user.findFirst({ where: { role: 'teacher' } });
  const admin = await prisma.user.findFirst({ where: { role: 'admin' } });
  
  // Fallback if specific roles missing, try staff for admin
  const staff = await prisma.user.findFirst({ where: { role: 'staff' } });
  const actingAdmin = admin || staff;

  if (!student || !teacher || !actingAdmin) {
    console.error('Could not find one of each role (Student, Teacher, Admin/Staff). Please seed users first.');
    return;
  }

  console.log(`Using Users: Student (${student.name}), Teacher (${teacher.name}), Admin (${actingAdmin.name})`);

  // 2. Create Inquiries (Anfragen)
  
  // Student -> Admin: "Antrag auf Home-Office"
  await prisma.inquiry.create({
    data: {
      userId: student.id,
      category: 'ADMIN',
      subject: 'Antrag auf Home-Office Tage',
      message: 'Hallo, ich würde gerne für nächste Woche Donnerstag und Freitag Remote beantragen, da ich einen Arzttermin in der Heimat habe. Ist das möglich?',
      status: 'OPEN'
    }
  });
  console.log('Created Inquiry: Student -> Admin');

  // Teacher -> Admin: "Beamer defekt"
  await prisma.inquiry.create({
    data: {
      userId: teacher.id,
      category: 'ADMIN',
      subject: 'Technik-Problem in Raum 101',
      message: 'Der Beamer in Raum 101 hat einen starken Grünstich und flackert. Das stört den Unterricht massiv. Bitte um schnelle Überprüfung.',
      status: 'OPEN'
    }
  });
  console.log('Created Inquiry: Teacher -> Admin');

  // Admin -> Teacher: "Notenabgabe" (Direct Message)
  await prisma.inquiry.create({
    data: {
      userId: actingAdmin.id,
      recipientId: teacher.id,
      category: 'TEACHER',
      subject: 'Dringend: Notenabgabe Modul JS-Basics',
      message: 'Bitte denken Sie daran, die Noten für das abgelaufene Modul bis spätestens Freitag einzutragen. Die Zertifikate müssen gedruckt werden.',
      status: 'OPEN'
    }
  });
  console.log('Created Inquiry: Admin -> Teacher');
  
  // 3. Create Bulletin Posts (Schwarzes Brett)

  // Student Post
  await prisma.bulletinPost.create({
    data: {
      userId: student.id,
      type: 'SEARCH',
      title: 'Suche Lerngruppe für Abschlussprojekt',
      description: 'Hi zusammen, ich suche noch 1-2 Leute für ein Fullstack-Projekt (Next.js, Tailwind, Supabase). Start ist in 2 Wochen. Wer hat Lust?',
      contactInfo: 'Einfach per DM melden oder in der Pause ansprechen.'
    }
  });
  console.log('Created Bulletin Post: Student');

  // Teacher Post
  await prisma.bulletinPost.create({
    data: {
      userId: teacher.id,
      type: 'OFFER',
      title: 'Fachbücher zu verschenken',
      description: 'Ich habe mein Regal aussortiert und vergebe diverse Bücher zu "Clean Code" und "Design Patterns". Liegen bei mir im Büro zur Abholung.',
      contactInfo: 'Kommt einfach vorbei (Raum 202)'
    }
  });
  console.log('Created Bulletin Post: Teacher');

  // Admin Post
  await prisma.bulletinPost.create({
    data: {
      userId: actingAdmin.id,
      type: 'OFFER', // Or INFO, using OFFER for now as generalized
      title: 'Fundsache: Laptop-Ladegerät',
      description: 'Ein Apple MagSafe Ladegerät wurde in der Küche gefunden. Kann am Empfang abgeholt werden.',
      contactInfo: 'Sekretariat / Empfang'
    }
  });
  console.log('Created Bulletin Post: Admin');

  console.log('Demo content generation finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
