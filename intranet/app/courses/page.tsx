import { getStudentCourses } from "@/lib/actions";
import { CourseViews } from "./course-views";

export default async function CoursesPage() {
  const courses = await getStudentCourses();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Kursplan</h1>
            <p className="text-muted-foreground">Alle anstehenden Vorlesungen und Übungen.</p>
        </div>
      </div>

      <CourseViews courses={JSON.parse(JSON.stringify(courses))} />
    </div>
  );
}
