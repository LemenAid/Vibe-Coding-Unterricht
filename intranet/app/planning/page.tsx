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
import { PlusCircle, Calendar, Users, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

export default async function PlanningPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    redirect("/");
  }

  // Fetch all EducationTracks sorted by start date
  const tracks = await prisma.educationTrack.findMany({
    orderBy: { startDate: 'desc' },
    include: {
      _count: {
        select: { users: true, courses: true }
      }
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planung & Verwaltung</h1>
          <p className="text-muted-foreground">
            Verwalten Sie hier Umschulungen (Education Tracks), deren Kurse und Teilnehmer.
          </p>
        </div>
        <div className="flex gap-2">
           <Link href="/planning/students/new">
            <Button variant="outline" className="gap-2">
              <Users size={16} />
              Neuer Schüler
            </Button>
          </Link>
          <Link href="/planning/new-track">
            <Button className="gap-2">
              <PlusCircle size={16} />
              Neue Umschulung
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <GraduationCap className="text-primary" size={24} />
          Verfügbare Umschulungen
        </h2>
        
        {tracks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tracks.map(track => (
              <Link key={track.id} href={`/planning/${track.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{track.title}</CardTitle>
                    <CardDescription>
                      {format(track.startDate, 'dd.MM.yyyy')} - {format(track.endDate, 'dd.MM.yyyy')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{track._count.users} Schüler</span>
                      <span>{track._count.courses} Kurse</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg bg-muted/20">
            <GraduationCap className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Keine Umschulungen gefunden</h3>
            <p className="text-muted-foreground mb-4">Legen Sie eine neue Umschulung an, um zu starten.</p>
            <Link href="/planning/new-track">
                <Button>Neue Umschulung anlegen</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
