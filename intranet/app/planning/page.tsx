import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default async function PlanningPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    redirect("/");
  }

  // Hole alle Kurse, sortiert nach Startdatum
  const courses = await prisma.course.findMany({
    orderBy: { startDate: 'desc' },
    include: {
      _count: {
        select: { students: true, teachers: true }
      }
    }
  });

  // Umschulungsstart-Zeiträume definieren (Sommer/Winter)
  // Anforderung: 2024, 2025, 2026 (Winter)
  const cohortRanges = [
    { label: "Winter 2026", year: 2026, season: 'Winter' },
    { label: "Sommer 2026", year: 2026, season: 'Sommer' },
    { label: "Winter 2025", year: 2025, season: 'Winter' },
    { label: "Sommer 2025", year: 2025, season: 'Sommer' },
    { label: "Winter 2024", year: 2024, season: 'Winter' },
    { label: "Sommer 2024", year: 2024, season: 'Sommer' },
  ];

  // Helper zum Zuordnen eines Kurses zu einer Kohorte
  const getCohortLabel = (date: Date) => {
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();
    // Annahme: Sommerkurse starten ca. Juni/Juli, Winter ca. Jan/Feb oder Nov/Dez?
    // Übliche Semesterzeiten oder einfach Halbjahr?
    // "ein jahr hat zwei start termine quasi sommer und winter"
    // Wir nehmen einfach Halbjahr 1 (Sommer-Start ca. Q2/Q3) und Halbjahr 2 (Winter-Start Q4/Q1)
    // Vereinfacht: Startet der Kurs in der ersten Jahreshälfte -> Sommer-Kohorte (oder Frühjahr), Zweite -> Winter
    // Oder besser: Wir schauen auf das Jahr der Maßnahme.
    
    // Aber warte, die Struktur soll sein: "Jahre -> Unterkategorien Sommer/Winter"
    // Ein Kurs gehört zu einer Umschulung.
    // Wir gruppieren Kurse hier einfach nach ihrem Startdatum in diese "Buckets"
    if (month >= 7) return `Winter ${year}`; // Ab Juli
    return `Sommer ${year}`; // Bis Juni
  };

  const coursesByCohort = courses.reduce((acc, course) => {
    const key = getCohortLabel(course.startDate);
    if (!acc[key]) acc[key] = [];
    acc[key].push(course);
    return acc;
  }, {} as Record<string, typeof courses>);

  // Sortierte Keys basierend auf cohortRanges
  const activeCohorts = cohortRanges.filter(c => coursesByCohort[c.label]?.length > 0 || true); // Zeige alle definierten an?

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kursplanung</h1>
          <p className="text-muted-foreground">
            Verwaltung von Umschulungen, Modulen und Teilnehmern
          </p>
        </div>
        <div className="flex gap-2">
           <Link href="/planning/students/new">
            <Button variant="outline" className="gap-2">
              <Users size={16} />
              Neuer Schüler
            </Button>
          </Link>
          <Link href="/planning/new">
            <Button className="gap-2">
              <PlusCircle size={16} />
              Neuer Kurs
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {activeCohorts.map(cohort => {
            const cohortCourses = coursesByCohort[cohort.label] || [];
            if (cohortCourses.length === 0 && cohort.year < 2024) return null; // Alte leere nicht anzeigen

            return (
                <div key={cohort.label} className="space-y-4 border-b pb-8 last:border-0">
                  <h2 className="text-2xl font-semibold flex items-center gap-2 text-primary">
                    <Calendar className="text-primary" size={24} />
                    Umschulung {cohort.label}
                  </h2>
                  
                  {cohortCourses.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {cohortCourses.map(course => (
                          <Link key={course.id} href={`/planning/${course.id}`}>
                            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full border-l-4 border-l-blue-500">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{course.title}</CardTitle>
                                <CardDescription>
                                  {format(course.startDate, 'dd.MM.yyyy')} - {format(course.endDate, 'dd.MM.yyyy')}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>{course._count.students} Teilnehmer</span>
                                  <span>{course._count.teachers} Dozenten</span>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                  ) : (
                      <div className="text-sm text-muted-foreground italic pl-2">
                          Noch keine Module für diesen Starttermin angelegt.
                      </div>
                  )}
                </div>
            );
        })}
      </div>
    </div>
  );
}
