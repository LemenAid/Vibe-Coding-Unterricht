import { getCurrentUser } from "@/lib/auth";
import { getTeacherExams, updateExamGrades } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { redirect } from "next/navigation";

export default async function TeacherExamsPage() {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'staff' && user.role !== 'admin' && user.role !== 'teacher')) {
        redirect("/");
    }

    const exams = await getTeacherExams();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Prüfungsverwaltung</h1>
                <p className="text-gray-500">Noten eintragen und Prüfungen verwalten.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Meine Prüfungen</CardTitle>
                    <CardDescription>
                        Liste aller Prüfungen der Kurse, denen Sie zugewiesen sind.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {exams.length === 0 ? (
                        <p className="text-gray-500">Keine Prüfungen gefunden.</p>
                    ) : (
                        <Accordion type="single" collapsible className="w-full">
                            {exams.map((exam) => (
                                <AccordionItem key={exam.id} value={exam.id}>
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex flex-col items-start gap-1 text-left">
                                            <span className="font-semibold">{exam.title}</span>
                                            <span className="text-xs text-gray-500">
                                                {exam.course?.title} • {new Date(exam.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="pt-2">
                                            <form action={updateExamGrades} className="space-y-4">
                                                <input type="hidden" name="examId" value={exam.id} />
                                                
                                                <div className="border rounded-md">
                                                    <div className="grid grid-cols-3 gap-4 p-3 bg-slate-50 border-b text-sm font-medium text-gray-700">
                                                        <div className="col-span-2">Schüler</div>
                                                        <div>Note</div>
                                                    </div>
                                                    {/* We need to list students of the course here. 
                                                        Ideally, `exam` should include course -> students. 
                                                    */}
                                                    {exam.course?.students.map((student) => {
                                                        // Find existing grade if any
                                                        const existingGrade = exam.grades.find(g => g.userId === student.id);
                                                        
                                                        return (
                                                            <div key={student.id} className="grid grid-cols-3 gap-4 p-3 items-center border-b last:border-0">
                                                                <div className="col-span-2 flex flex-col">
                                                                    <span className="font-medium">{student.name}</span>
                                                                    <span className="text-xs text-gray-500">{student.email}</span>
                                                                </div>
                                                                <div>
                                                                    <Input 
                                                                        type="number" 
                                                                        step="0.1" 
                                                                        min="1.0" 
                                                                        max="6.0"
                                                                        name={`grade-${student.id}`} 
                                                                        defaultValue={existingGrade?.value}
                                                                        placeholder="-"
                                                                        className="w-20"
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    {(!exam.course?.students || exam.course.students.length === 0) && (
                                                         <div className="p-4 text-center text-sm text-gray-500">Keine Schüler in diesem Kurs.</div>
                                                    )}
                                                </div>

                                                <div className="flex justify-end">
                                                    <Button type="submit">Noten Speichern</Button>
                                                </div>
                                            </form>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
