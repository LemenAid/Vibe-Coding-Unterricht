import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, User, Clock } from "lucide-react";
import { getAllCourseEvents } from "@/lib/actions";

export default async function CoursesPage() {
  const courses = await getAllCourseEvents();

  // Gruppieren nach Datum
  const groupedCourses = courses.reduce((acc, course) => {
    const date = course.startTime.toLocaleDateString('de-DE', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(course);
    return acc;
  }, {} as Record<string, typeof courses>);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kursplan</h1>
        <p className="text-gray-500">Alle anstehenden Vorlesungen und Übungen.</p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedCourses).map(([date, events]) => (
          <div key={date} className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
                <CalendarDays className="h-5 w-5" />
                {date}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <Badge variant="outline" className="mb-2">
                            {event.startTime.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} 
                            - 
                            {event.endTime.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}
                        </Badge>
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <p>{event.description}</p>
                    
                    <div className="flex items-center gap-2 pt-2 border-t mt-2">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>{event.instructor}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        {courses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                Keine Kurse gefunden.
            </div>
        )}
      </div>
    </div>
  );
}
