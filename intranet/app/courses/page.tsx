import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, User, List, Grid } from "lucide-react";
import { getAllCourseEvents } from "@/lib/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function CoursesPage() {
  const courses = await getAllCourseEvents();

  // Gruppieren nach Datum für Kachel-Ansicht
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
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Kursplan</h1>
            <p className="text-gray-500">Alle anstehenden Vorlesungen und Übungen.</p>
        </div>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="cards"><Grid className="mr-2 h-4 w-4"/> Kacheln</TabsTrigger>
          <TabsTrigger value="list"><List className="mr-2 h-4 w-4"/> Liste</TabsTrigger>
          <TabsTrigger value="calendar"><CalendarDays className="mr-2 h-4 w-4"/> Kalender</TabsTrigger>
        </TabsList>

        {/* ANSICHT 1: KACHELN (Original) */}
        <TabsContent value="cards" className="mt-6 space-y-8">
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
        </TabsContent>

        {/* ANSICHT 2: LISTE (Detailliert) */}
        <TabsContent value="list" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Detaillierte Kursliste</CardTitle>
                    <CardDescription>Alle Module mit vollständigen Details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Datum</TableHead>
                                <TableHead>Zeit</TableHead>
                                <TableHead>Modul</TableHead>
                                <TableHead>Dozent</TableHead>
                                <TableHead>Raum</TableHead>
                                <TableHead>Beschreibung</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-medium">
                                        {course.startTime.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                    </TableCell>
                                    <TableCell>
                                        {course.startTime.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} - {course.endTime.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}
                                    </TableCell>
                                    <TableCell className="font-semibold">{course.title}</TableCell>
                                    <TableCell>{course.instructor}</TableCell>
                                    <TableCell>{course.location}</TableCell>
                                    <TableCell className="text-gray-500 max-w-xs truncate" title={course.description || ''}>
                                        {course.description}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        {/* ANSICHT 3: KALENDER (Placeholder / Simple View) */}
        <TabsContent value="calendar" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Monatsübersicht</CardTitle>
                    <CardDescription>Die Tage mit Kursen sind markiert.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <div className="p-4 border rounded-md w-full">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(groupedCourses).map(([date, events]) => (
                                <div key={date} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="text-center font-bold mb-2 border-b pb-2">{date.split(',')[0]}</div> 
                                    <div className="space-y-2">
                                        {events.map(e => (
                                            <div key={e.id} className="text-xs p-2 bg-white rounded border border-l-4 border-l-blue-500 shadow-sm">
                                                <div className="font-bold">{e.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                                <div className="truncate">{e.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
      
        {courses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                Keine Kurse gefunden.
            </div>
        )}
    </div>
  );
}
