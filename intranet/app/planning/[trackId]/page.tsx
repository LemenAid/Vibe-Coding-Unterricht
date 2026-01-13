import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { revalidatePath } from "next/cache";

export default async function TrackDetailPage({ params }: { params: Promise<{ trackId: string }> }) {
  const { trackId } = await params;
  const user = await getCurrentUser();

  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    redirect("/");
  }

  const track = await prisma.educationTrack.findUnique({
    where: { id: trackId },
    include: {
      users: true,
      courses: {
          orderBy: { startDate: 'asc' },
          include: {
              _count: {
                  select: { students: true, teachers: true }
              }
          }
      }
    }
  });

  if (!track) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
       <div className="flex items-center gap-4 mb-6">
        <Link href="/planning">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{track.title}</h1>
          <p className="text-muted-foreground">
            {format(track.startDate, 'dd.MM.yyyy')} - {format(track.endDate, 'dd.MM.yyyy')}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Kurs-Liste */}
        <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Kurse & Module</CardTitle>
                    <CardDescription>Kurse in dieser Umschulung</CardDescription>
                </div>
                 <Link href={`/planning/course/new?trackId=${trackId}`}>
                    <Button size="sm" className="gap-2">
                        <PlusCircle size={16} /> Neuer Kurs
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {track.courses.map(course => (
                         <Link key={course.id} href={`/planning/course/${course.id}`}>
                            <div className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                                <div>
                                    <p className="font-medium">{course.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(course.startDate, 'dd.MM.yy')} - {format(course.endDate, 'dd.MM.yy')}
                                    </p>
                                </div>
                                <div className="text-xs text-muted-foreground text-right">
                                    <p>{course._count.students} Teilnehmer</p>
                                    <p>{course._count.teachers} Dozenten</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {track.courses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Keine Kurse angelegt</p>}
                </div>
            </CardContent>
        </Card>

        {/* Schüler-Liste der Umschulung */}
        <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
                <CardTitle>Eingeschriebene Schüler</CardTitle>
                <CardDescription>Schüler in diesem Jahrgang ({track.users.length})</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {track.users.map(student => (
                        <div key={student.id} className="flex justify-between items-center p-2 border rounded-md bg-muted/20">
                            <div>
                                <p className="font-medium text-sm">{student.name}</p>
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                    <span>{student.email}</span>
                                    {student.measureNumber && <span className="bg-blue-100 text-blue-800 px-1 rounded">{student.measureNumber}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {track.users.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Keine Schüler zugewiesen</p>}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
