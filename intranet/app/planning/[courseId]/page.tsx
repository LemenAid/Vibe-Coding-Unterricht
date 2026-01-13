import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, UserPlus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { revalidatePath } from "next/cache";

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const user = await getCurrentUser();

  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      students: true,
      teachers: true
    }
  });

  if (!course) {
    notFound();
  }

  // Server Actions für Zuweisungen (Inline für Einfachheit hier, idealerweise ausgelagert)
  async function addStudent(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const student = await prisma.user.findUnique({ where: { email } });
    
    if (student && student.role === 'student') {
       await prisma.course.update({
         where: { id: courseId },
         data: {
           students: { connect: { id: student.id } }
         }
       });
       revalidatePath(`/planning/${courseId}`);
    }
  }

  async function addTeacher(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const teacher = await prisma.user.findUnique({ where: { email } });
    
    if (teacher && (teacher.role === 'staff' || teacher.role === 'admin')) { // Annahme: Staff kann auch unterrichten
        // Oder wir bräuchten eine 'teacher' rolle. Im Schema steht "staff". 
        // User Role: "admin", "student", "staff". "Dozenten" sind vermutlich "staff" oder extern?
        // Im Prompt steht "Dozenten". Nehmen wir an Staff = Dozenten.
       await prisma.course.update({
         where: { id: courseId },
         data: {
           teachers: { connect: { id: teacher.id } }
         }
       });
       revalidatePath(`/planning/${courseId}`);
    }
  }

  async function removeUser(userId: string, type: 'student' | 'teacher') {
      "use server";
      if (type === 'student') {
          await prisma.course.update({
              where: { id: courseId },
              data: { students: { disconnect: { id: userId } } }
          });
      } else {
          await prisma.course.update({
            where: { id: courseId },
            data: { teachers: { disconnect: { id: userId } } }
        });
      }
      revalidatePath(`/planning/${courseId}`);
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
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">
            {format(course.startDate, 'dd.MM.yyyy')} - {format(course.endDate, 'dd.MM.yyyy')}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dozenten Bereich */}
        <Card>
            <CardHeader>
                <CardTitle>Dozenten</CardTitle>
                <CardDescription>Zugewiesene Lehrkräfte für dieses Modul</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form action={addTeacher} className="flex gap-2">
                    <input 
                        name="email" 
                        type="email" 
                        placeholder="Dozent Email..." 
                        className="flex-1 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                        required
                    />
                    <Button size="sm" type="submit"><UserPlus size={16} /></Button>
                </form>

                <div className="space-y-2">
                    {course.teachers.map(teacher => (
                        <div key={teacher.id} className="flex justify-between items-center p-2 border rounded-md bg-muted/20">
                            <div>
                                <p className="font-medium text-sm">{teacher.name}</p>
                                <p className="text-xs text-muted-foreground">{teacher.email}</p>
                            </div>
                            <form action={async () => {
                                "use server";
                                await removeUser(teacher.id, 'teacher');
                            }}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 size={16} />
                                </Button>
                            </form>
                        </div>
                    ))}
                    {course.teachers.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Keine Dozenten zugewiesen</p>}
                </div>
            </CardContent>
        </Card>

        {/* Studenten Bereich */}
        <Card>
            <CardHeader>
                <CardTitle>Teilnehmer</CardTitle>
                <CardDescription>Zugewiesene Schüler für dieses Modul</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <form action={addStudent} className="flex gap-2">
                    <input 
                        name="email" 
                        type="email" 
                        placeholder="Schüler Email..." 
                        className="flex-1 h-9 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                        required
                    />
                    <Button size="sm" type="submit"><UserPlus size={16} /></Button>
                </form>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {course.students.map(student => (
                        <div key={student.id} className="flex justify-between items-center p-2 border rounded-md bg-muted/20">
                            <div>
                                <p className="font-medium text-sm">{student.name}</p>
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                    <span>{student.email}</span>
                                    {student.measureNumber && <span className="bg-blue-100 text-blue-800 px-1 rounded">{student.measureNumber}</span>}
                                </div>
                            </div>
                            <form action={async () => {
                                "use server";
                                await removeUser(student.id, 'student');
                            }}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 size={16} />
                                </Button>
                            </form>
                        </div>
                    ))}
                    {course.students.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Keine Teilnehmer zugewiesen</p>}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
