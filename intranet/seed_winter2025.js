const { PrismaClient } = require('./generated-client');
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding Winter 2025 cohort...");

  // 1. User IDs abrufen
  const prof = await prisma.user.findUnique({ where: { email: 'prof-code@cc-corp.de' } });
  const marc = await prisma.user.findUnique({ where: { email: 'marc@cc-student.de' } });
  const felippa = await prisma.user.findUnique({ where: { email: 'felippa@cc-student.de' } });

  if (!prof || !marc || !felippa) {
    console.error("Users not found. Please run existing seed first.");
    return;
  }

  // Update Students with measureNumber and department (Winter 2025)
  // Check if fields exist before update to debug
  console.log("Updating Marc...");
  try {
      await prisma.user.update({ where: { id: marc.id }, data: { measureNumber: "123/456/2025", department: "Winter 2025" } });
  } catch (e) {
      console.log("Failed to update Marc. Schema mismatch?");
      throw e;
  }
  
  console.log("Updating Felippa...");
  await prisma.user.update({ where: { id: felippa.id }, data: { measureNumber: "789/012/2025", department: "Winter 2025" } });
  console.log("Students updated.");


  // 2. Kursdatenbank (typische Module für Fachinformatiker/Entwickler Umschulung)
  const modules = [
    { title: "IT-Grundlagen & Hardware", days: 20 },
    { title: "Betriebssysteme (Linux/Windows)", days: 20 },
    { title: "Netzwerktechnik Grundlagen", days: 25 },
    { title: "Programmierung Grundlagen (Logik/Algorithmen)", days: 30 },
    { title: "Datenbanken (SQL)", days: 25 },
    { title: "Web-Entwicklung HTML/CSS", days: 20 },
    { title: "JavaScript & TypeScript", days: 30 },
    { title: "React & Frontend Frameworks", days: 30 },
    { title: "Backend Entwicklung (Node.js/Python)", days: 30 },
    { title: "Software Engineering & Projektmanagement", days: 15 },
    { title: "Abschlussprojekt Vorbereitung", days: 40 },
  ];

  let currentDate = new Date('2025-02-03'); 
  
  for (const mod of modules) {
    const durationDays = mod.days;
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + (durationDays * 1.4)); 

    console.log(`Creating course: ${mod.title}`);

    await prisma.course.create({
      data: {
        title: mod.title,
        description: `Inhalte des Moduls ${mod.title}...`,
        startDate: currentDate,
        endDate: endDate,
        teachers: {
          connect: [{ id: prof.id }]
        },
        students: {
          connect: [{ id: marc.id }, { id: felippa.id }]
        }
      }
    });

    currentDate = new Date(endDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log("Winter 2025 seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
