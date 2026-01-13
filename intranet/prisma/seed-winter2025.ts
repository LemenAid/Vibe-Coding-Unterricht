import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Winter 2025 Schedule...');

  // 1. Create the Education Track
  const track = await prisma.educationTrack.create({
    data: {
      title: 'Fachinformatiker Anwendungsentwicklung (Winter 2025)',
      startDate: new Date('2025-12-23'), // Start based on first entry
      endDate: new Date('2027-02-02'),   // End based on last entry
    },
  });

  console.log(`Created Track: ${track.title}`);

  // Helper function to create a Course with Topics
  const createCourseWithTopics = async (title: string, startDate: string, endDate: string, topics: { start: string; end: string; title: string; ue: number }[]) => {
    // Create the Course
    const course = await prisma.course.create({
      data: {
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        educationTrackId: track.id,
        description: title.includes("Praxisphase") ? "Betriebliche Praxisphase im Unternehmen" : "Unterrichtsmodul",
      },
    });

    // Create Topics
    for (const topic of topics) {
      await prisma.courseTopic.create({
        data: {
          title: topic.title,
          startDate: new Date(topic.start),
          endDate: new Date(topic.end),
          durationUnits: topic.ue || 0,
          courseId: course.id,
        },
      });
    }
  };

  // Helper for Holidays (Create a "Holiday" Course to ensure it shows in calendar)
  const createHoliday = async (startDate: string, endDate: string, title: string = "Unterrichtsfreie Zeit") => {
    const course = await prisma.course.create({
      data: {
        title: title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        educationTrackId: track.id,
        description: "Kein Unterricht",
      },
    });
    
    await prisma.courseTopic.create({
        data: {
            title: title,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            durationUnits: 0,
            courseId: course.id
        }
    })
  };

  // --- DATA ENTRY START ---

  // 1. Unterrichtsfreie Zeit: 23.12.2025 - 07.01.2026
  await createHoliday('2025-12-23', '2026-01-07');

  // 2. Fachrichtungsübergreifendes Modul II
  await createCourseWithTopics(
    "Fachrichtungsübergreifendes Modul II",
    "2026-01-08", "2026-01-28",
    [
      { start: '2026-01-08', end: '2026-01-08', title: 'Aufbau und Organisation des Ausbildungsbetriebes', ue: 10 },
      { start: '2026-01-09', end: '2026-01-09', title: 'Sicherheit, Gesundheits- und Umweltschutz', ue: 5 },
      { start: '2026-01-09', end: '2026-01-13', title: 'Vertiefung: Betreiben von IT-Systemen', ue: 25 },
      { start: '2026-01-14', end: '2026-01-19', title: 'Inbetriebnehmen von Speicherlösungen', ue: 35 },
      { start: '2026-01-19', end: '2026-01-27', title: 'Vertiefung: Programmieren von Softwarelösungen', ue: 65 },
      { start: '2026-01-28', end: '2026-01-28', title: 'Klausur', ue: 10 },
    ]
  );

  // 3. Fachspezifisches Modul II Teil 1
  await createCourseWithTopics(
    "Fachspezifisches Modul II Teil 1",
    "2026-01-29", "2026-02-11",
    [
      { start: '2026-01-29', end: '2026-02-11', title: 'Anwendungslösungen unter Berücksichtigung der bestehenden Systemarchitektur entwerfen und realisieren', ue: 100 },
    ]
  );

  // 4. Vorbereitung schriftliche Prüfung Teil 1
  await createCourseWithTopics(
    "Vorbereitung schriftliche Prüfung Teil 1: Einrichten eines IT-gestützten Arbeitsplatzes",
    "2026-02-12", "2026-02-25",
    [
      { start: '2026-02-12', end: '2026-02-25', title: 'Wiederholung des prüfungsrelevanten Stoffes', ue: 90 },
    ]
  );

  // 5. Fachspezifisches Modul II Teil 2
  await createCourseWithTopics(
    "Fachspezifisches Modul II Teil 2",
    "2026-02-26", "2026-03-24",
    [
      { start: '2026-02-26', end: '2026-03-04', title: 'Anwendungslösungen unter Berücksichtigung der bestehenden Systemarchitektur entwerfen und realisieren', ue: 50 },
      { start: '2026-03-05', end: '2026-03-09', title: 'Bestehende Anwendungslösungen anpassen', ue: 30 },
      { start: '2026-03-10', end: '2026-03-11', title: 'Datenaustausch zwischen Systemen realisieren und unterschiedliche Datenquellen nutzen', ue: 20 },
      { start: '2026-03-12', end: '2026-03-16', title: 'Komplexe Abfragen aus unterschiedlichen Datenquellen durchführen und Datenbestandsberichte erstellen', ue: 30 },
      { start: '2026-03-17', end: '2026-03-19', title: 'Werkzeuge zur Versionsverwaltung einsetzen', ue: 25 },
      { start: '2026-03-19', end: '2026-03-20', title: 'Testkonzepte erstellen und Tests durchführen', ue: 15 },
      { start: '2026-03-23', end: '2026-03-23', title: 'Daten/Sachverhalte aus Tests multimedial aufbereiten und präsentieren', ue: 10 },
      { start: '2026-03-24', end: '2026-03-24', title: 'Klausur', ue: 10 },
    ]
  );

  // 6. Betriebliche Praxisphase (Starts)
  await createCourseWithTopics("Betriebliche Praxisphase", "2026-03-25", "2026-04-02", [{ start: '2026-03-25', end: '2026-04-02', title: 'Praxisphase im Betrieb', ue: 0 }]);
  await createHoliday('2026-04-03', '2026-04-03');
  await createHoliday('2026-04-06', '2026-04-06');
  
  await createCourseWithTopics("Betriebliche Praxisphase", "2026-04-07", "2026-04-30", [{ start: '2026-04-07', end: '2026-04-30', title: 'Praxisphase im Betrieb', ue: 0 }]);
  await createHoliday('2026-05-01', '2026-05-01');

  await createCourseWithTopics("Betriebliche Praxisphase", "2026-05-04", "2026-05-13", [{ start: '2026-05-04', end: '2026-05-13', title: 'Praxisphase im Betrieb', ue: 0 }]);
  await createHoliday('2026-05-14', '2026-05-14');

  await createCourseWithTopics("Betriebliche Praxisphase", "2026-05-15", "2026-05-22", [{ start: '2026-05-15', end: '2026-05-22', title: 'Praxisphase im Betrieb', ue: 0 }]);
  await createHoliday('2026-05-25', '2026-05-25');

  await createCourseWithTopics("Betriebliche Praxisphase", "2026-05-26", "2026-06-03", [{ start: '2026-05-26', end: '2026-06-03', title: 'Praxisphase im Betrieb', ue: 0 }]);
  await createHoliday('2026-06-04', '2026-06-04');

  // Long Praxis Phase
  await createCourseWithTopics("Betriebliche Praxisphase", "2026-06-05", "2026-09-03", [{ start: '2026-06-05', end: '2026-09-03', title: 'Praxisphase im Betrieb', ue: 0 }]);

  // Holiday
  await createHoliday('2026-09-04', '2026-09-07');

  // 7. Vorbereitung schriftliche Prüfung Teil 2 (Blocks)
  await createCourseWithTopics(
    "Vorbereitung schriftliche Prüfung Teil 2 (Block 1)",
    "2026-09-08", "2026-10-02",
    [{ start: '2026-09-08', end: '2026-10-02', title: 'Wiederholung des prüfungsrelevanten Stoffes', ue: 171 }]
  );
  await createHoliday('2026-10-03', '2026-10-03');

  await createCourseWithTopics(
    "Vorbereitung schriftliche Prüfung Teil 2 (Block 2)",
    "2026-10-05", "2026-10-09",
    [{ start: '2026-10-05', end: '2026-10-09', title: 'Wiederholung des prüfungsrelevanten Stoffes', ue: 45 }]
  );

  // Praxis Interruption
  await createCourseWithTopics("Betriebliche Praxisphase", "2026-10-12", "2026-10-30", [{ start: '2026-10-12', end: '2026-10-30', title: 'Praxisphase im Betrieb', ue: 0 }]);
  await createHoliday('2026-11-01', '2026-11-01');

  await createCourseWithTopics(
    "Vorbereitung schriftliche Prüfung Teil 2 (Block 3)",
    "2026-11-02", "2026-11-17",
    [{ start: '2026-11-02', end: '2026-11-17', title: 'Wiederholung des prüfungsrelevanten Stoffes', ue: 108 }]
  );
  await createHoliday('2026-11-18', '2026-11-18');

  await createCourseWithTopics(
    "Vorbereitung schriftliche Prüfung Teil 2 (Block 4)",
    "2026-11-19", "2026-11-25",
    [{ start: '2026-11-19', end: '2026-11-25', title: 'Wiederholung des prüfungsrelevanten Stoffes', ue: 45 }]
  );
  await createHoliday('2026-11-26', '2026-11-27');

  // 8. Vorbereitung mündliche Prüfung / BvB
  await createCourseWithTopics(
    "Vorbereitung mündliche Prüfung / berufsvorbereitende Maßnahmen",
    "2026-11-30", "2026-12-23",
    [{ start: '2026-11-30', end: '2026-12-23', title: 'Vorbereitung mündliche Prüfung / BvB', ue: 162 }]
  );

  await createHoliday('2026-12-24', '2027-01-06');

  await createCourseWithTopics(
    "Vorbereitung mündliche Prüfung / Abschluss",
    "2027-01-07", "2027-02-02",
    [
      { start: '2027-01-07', end: '2027-01-27', title: 'Vorbereitung mündliche Prüfung / BvB', ue: 135 },
      { start: '2027-01-28', end: '2027-01-29', title: 'Zeitmanagement', ue: 18 },
      { start: '2027-02-01', end: '2027-02-02', title: 'Berufsvorbereitende Maßnahmen', ue: 18 },
    ]
  );

  console.log('Finished Seeding Winter 2025 Schedule.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
