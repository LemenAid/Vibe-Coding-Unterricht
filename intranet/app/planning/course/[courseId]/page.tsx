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
        teachers: true,
        educationTrack: { // Include parent track info
            include: {
                users: true // Get all potential students from the track
            }
        }
      }
    });

    if (!course) {
        notFound();
    }

    const allTeachers = await prisma.user.findMany({
        where: { role: { in: ['staff', 'admin', 'teacher'] } }, // Added teacher role
        include: { 
            teacherSkills: {
                include: { tag: true }
            }
        }
    });


    // Recommended teachers logic
    const recommendedTeachers = allTeachers.map(teacher => {
        const hasSkill = teacher.teacherSkills.some(skill => 
             course.title.toLowerCase().includes(skill.tag.name.toLowerCase()) && skill.isActive
        );
        // Simple conflict check (very basic for MVP)
        // Ideally we would check CourseEvent overlaps here
        const isAvailable = true; 

        return { ...teacher, isRecommended: hasSkill, isAvailable };
    }).sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));

    // Server Actions
    async function assignTeacher(formData: FormData) {
        "use server";
        const teacherId = formData.get("teacherId") as string;
        await prisma.course.update({
             where: { id: courseId },
             data: { teachers: { connect: { id: teacherId } } }
        });
        revalidatePath(`/planning/course/${courseId}`);
    }

    async function toggleStudent(formData: FormData) {
        "use server";
        const studentId = formData.get("studentId") as string;
        const isAssigned = formData.get("isAssigned") === "true";

        if (isAssigned) {
            await prisma.course.update({
                where: { id: courseId },
                data: { students: { disconnect: { id: studentId } } }
            });
        } else {
             // Check max students limit
             const currentCount = await prisma.user.count({
                 where: { coursesAsStudent: { some: { id: courseId } } }
             });
             
             if (currentCount >= 25) {
                 // Error handling ideally via toast/state, but for MVP simple return or throw
                 return; 
             }

             await prisma.course.update({
                where: { id: courseId },
                data: { students: { connect: { id: studentId } } }
            });
        }
        revalidatePath(`/planning/course/${courseId}`);
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
                <CardTitle>Dozenten Zuweisung</CardTitle>
                <CardDescription>Verfügbare Lehrkräfte für dieses Modul</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {recommendedTeachers.map(teacher => {
                        const isAssigned = course.teachers.some(t => t.id === teacher.id);
                        return (
                            <div key={teacher.id} className={`flex justify-between items-center p-2 border rounded-md ${isAssigned ? 'bg-green-50 border-green-200' : 'bg-card'}`}>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">{teacher.name}</p>
                                        {teacher.isRecommended && <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded border border-blue-200">Empfohlen</span>}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{teacher.email}</p>
                                     <div className="flex flex-wrap gap-1 mt-1">
                                          {teacher.teacherSkills.map(s => (
                                              <span key={s.id} className="text-[10px] text-muted-foreground bg-muted px-1 rounded">{s.tag.name}</span>
                                          ))}
                                     </div>
                                </div>
                                {isAssigned ? (
                                     <form action={async () => {
                                        "use server";
                                        await removeUser(teacher.id, 'teacher');
                                    }}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                            <Trash2 size={16} />
                                        </Button>
                                    </form>
                                ) : (
                                    <form action={assignTeacher}>
                                        <input type="hidden" name="teacherId" value={teacher.id} />
                                        <Button size="sm" variant="outline" type="submit"><UserPlus size={16} /></Button>
                                    </form>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>

        {/* Studenten Bereich */}
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Teilnehmer ({course.students.length} / {course.maxStudents})</CardTitle>
                        <CardDescription>Schüler aus {course.educationTrack?.title || "keiner Umschulung"}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {course.educationTrack ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {course.educationTrack.users.map(student => {
                            const isAssigned = course.students.some(s => s.id === student.id);
                            return (
                                <div key={student.id} className={`flex justify-between items-center p-2 border rounded-md ${isAssigned ? 'bg-green-50 border-green-200' : ''}`}>
                                    <div>
                                        <p className="font-medium text-sm">{student.name}</p>
                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                            <span>{student.email}</span>
                                        </div>
                                    </div>

                                    <form action={toggleStudent}>
                                        <input type="hidden" name="studentId" value={student.id} />
                                        <input type="hidden" name="isAssigned" value={String(isAssigned)} />
                                        <Button 
                                            size="sm" 
                                            variant={isAssigned ? "ghost" : "outline"}
                                            className={isAssigned ? "text-red-500 hover:text-red-700 hover:bg-red-50" : ""}
                                            type="submit"
                                            disabled={!isAssigned && course.students.length >= course.maxStudents}
                                        >
                                            {isAssigned ? <Trash2 size={16} /> : "Hinzufügen"}
                                        </Button>
                                    </form>

                                </div>
                            );
                        })}
                        {course.educationTrack.users.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Keine Schüler in dieser Umschulung</p>}
                    </div>
                ) : (
                    <div className="p-4 border border-dashed rounded bg-muted/20 text-center text-sm text-muted-foreground">
                        Dieser Kurs ist keiner Umschulung zugewiesen. Schüler können nur manuell über DB zugewiesen werden.
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
