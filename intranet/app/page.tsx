import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Calendar, 
  Megaphone, 
  Pin,
  ArrowRight
} from "lucide-react";
import { 
  getAnnouncements, 
  getCourseEvents, 
  getLastTimeEntry, 
  clockIn, 
  clockOut 
} from "@/lib/actions";

export default async function Home() {
  const announcements = await getAnnouncements();
  const nextCourses = await getCourseEvents();
  const lastEntry = await getLastTimeEntry();
  
  const isClockedIn = lastEntry && !lastEntry.clockOut;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Willkommen zurück, Max Mustermann.</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Hauptspalte Links (4/7) */}
        <div className="space-y-6 lg:col-span-4">
            
          {/* Zeiterfassung Widget */}
          <Card className={isClockedIn ? "border-green-500 bg-green-50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Zeiterfassung
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isClockedIn ? "Eingestempelt" : "Ausgestempelt"}
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                {isClockedIn 
                  ? `Seit ${lastEntry?.clockIn.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} Uhr` 
                  : "Du bist aktuell nicht bei der Arbeit."}
              </p>
              
              <form action={async () => {
                "use server";
                if (isClockedIn) {
                   await clockOut(lastEntry!.id);
                } else {
                   await clockIn();
                }
              }}>
                <Button 
                    className={isClockedIn ? "w-full bg-red-600 hover:bg-red-700" : "w-full bg-green-600 hover:bg-green-700"}
                    size="lg"
                >
                  {isClockedIn ? "Jetzt Ausstempeln" : "Jetzt Einstempeln"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Kursplan Widget */}
          <Card>
            <CardHeader>
              <CardTitle>Nächste Kurse</CardTitle>
              <CardDescription>Dein Fahrplan für heute und morgen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nextCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.location} • {course.instructor}
                      </p>
                    </div>
                    <div className="text-right">
                       <Badge variant="outline">
                        {course.startTime.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}
                       </Badge>
                    </div>
                  </div>
                ))}
                {nextCourses.length === 0 && (
                    <p className="text-sm text-gray-500">Keine anstehenden Kurse.</p>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Seitenspalte Rechts (3/7) */}
        <div className="space-y-6 lg:col-span-3">
          
          {/* Announcements Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone size={18} /> News
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((news) => (
                <div key={news.id} className="bg-gray-50 p-3 rounded-lg border">
                  <h4 className="font-semibold text-sm text-blue-700">{news.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{news.content}</p>
                  <p className="text-[10px] text-gray-400 mt-2 text-right">
                    {news.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

           {/* Quick Link Bulletin */}
           <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Pin size={18} /> Schwarzes Brett
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-indigo-100 text-sm mb-4">
                Suche nach Lerngruppen, biete Bücher an oder finde Tandem-Partner.
              </p>
              <Button variant="secondary" className="w-full text-indigo-600" asChild>
                  <a href="/bulletin">Zum Brett <ArrowRight size={16} className="ml-2"/></a>
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
