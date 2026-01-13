import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
  Clock, 
  Megaphone, 
  Pin,
  ArrowRight,
  PlusCircle,
  GraduationCap,
  HelpCircle,
  CalendarDays
} from "lucide-react";
import { 
  getAnnouncements, 
  getCourseEvents, 
  getLastTimeEntry, 
  clockIn, 
  clockOut,
  createAnnouncement,
  createInquiry,
  getOpenInquiries,
  resolveInquiry
} from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const user = await requireUser(); // Login Check

  const announcements = await getAnnouncements();
  const nextCourses = await getCourseEvents();
  const lastEntry = await getLastTimeEntry();
  
  // Nur abrufen, wenn kein Student
  const openInquiries = user.role !== 'student' ? await getOpenInquiries() : [];
  
  const isClockedIn = lastEntry && !lastEntry.clockOut;
  const isStaffOrAdmin = user.role === 'admin' || user.role === 'staff';

  // --- Prüfungen basierend auf Rolle und Zuweisung ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let nextExams: any[] = [];
  try {
    if (user.role === 'student') {
      nextExams = await prisma.exam.findMany({
        where: {
          date: { gte: new Date() },
          course: {
            students: {
              some: { id: user.id }
            }
          }
        },
        orderBy: { date: 'asc' },
        take: 5,
        include: { course: true }
      });
    } else if (user.role === 'staff' || user.role === 'admin') {
       nextExams = await prisma.exam.findMany({
          where: {
            date: { gte: new Date() },
            course: {
              teachers: {
                some: { id: user.id }
              }
            }
          },
          orderBy: { date: 'asc' },
          take: 5,
          include: { course: true }
        });
    }
  } catch (e) {
      console.error("Error fetching exams", e);
      // Fallback: Keine Prüfungen anzeigen, wenn die Query fehlschlägt 
      // (z.B. weil der generated Client noch nicht aktuell ist)
      nextExams = [];
  }

  // Formatierungs-Helper
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Willkommen zurück, {user.name}.</p>
        </div>
        
        <div className="flex items-center gap-4">
             <div className="text-right text-sm text-gray-500">
              {formatDate(new Date())}
            </div>
            
            {/* Frage Einreichen Dialog - Nur für Studenten sichtbar (oder alle, wenn gewünscht) */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <HelpCircle size={16} /> Frage einreichen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Frage stellen</DialogTitle>
                  <DialogDescription>
                    Sende eine Anfrage an das Lehrpersonal oder die Administration.
                  </DialogDescription>
                </DialogHeader>
                <form action={createInquiry} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">An wen?</Label>
                         <Select name="category" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Wähle einen Empfänger" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TEACHER">Lehrer / Dozenten</SelectItem>
                            <SelectItem value="ADMIN">Administration / IT</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Betreff</Label>
                        <Input id="subject" name="subject" placeholder="Kurze Zusammenfassung" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Deine Nachricht</Label>
                        <Textarea id="message" name="message" placeholder="Beschreibe dein Anliegen..." required />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Absenden</Button>
                    </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
              
              <form action={async (formData) => {
                "use server";
                if (isClockedIn) {
                   await clockOut(lastEntry!.id);
                } else {
                   await clockIn(formData);
                }
              }}>
                <div className="flex flex-col gap-3">
                    {!isClockedIn && (
                         <Select name="location" defaultValue="ON_SITE">
                          <SelectTrigger>
                            <SelectValue placeholder="Arbeitsort wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {user.role === 'student' ? (
                                <>
                                    <SelectItem value="ON_CAMPUS">🎓 On-Campus</SelectItem>
                                    <SelectItem value="TELELEARNING">🏠 Tele-Learning</SelectItem>
                                </>
                            ) : (
                                <>
                                    <SelectItem value="ON_SITE">🏢 On-Site (Büro/Campus)</SelectItem>
                                    <SelectItem value="HOME_OFFICE">🏠 Home-Office</SelectItem>
                                </>
                            )}
                          </SelectContent>
                        </Select>
                    )}
                    <Button 
                        className={isClockedIn ? "w-full bg-red-600 hover:bg-red-700" : "w-full bg-green-600 hover:bg-green-700"}
                        size="lg"
                    >
                      {isClockedIn ? "Jetzt Ausstempeln" : "Jetzt Einstempeln"}
                    </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* OFFENE ANFRAGEN WIDGET (Nur für Staff/Admin) */}
          {isStaffOrAdmin && (
             <Card className="border-orange-200 bg-orange-50">
               <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-orange-800">
                    <HelpCircle size={18} /> Offene Anfragen ({openInquiries.length})
                 </CardTitle>
                 <CardDescription>Anfragen von Studenten, die deine Aufmerksamkeit benötigen.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 {openInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="bg-white p-4 rounded-lg border shadow-sm flex flex-col gap-3">
                        <div>
                            <h4 className="font-semibold text-sm">{inquiry.subject}</h4>
                            <p className="text-xs text-gray-500 mt-1">Von: {inquiry.user.name}</p>
                            <p className="text-sm text-gray-700 mt-2">{inquiry.message}</p>
                        </div>
                        <form action={resolveInquiry} className="flex gap-2 items-end w-full">
                            <input type="hidden" name="inquiryId" value={inquiry.id} />
                            <div className="flex-1">
                                <Label htmlFor={`answer-${inquiry.id}`} className="sr-only">Antwort</Label>
                                <Input 
                                    id={`answer-${inquiry.id}`} 
                                    name="answer" 
                                    placeholder="Antwort schreiben..." 
                                    className="h-8 text-xs"
                                    required 
                                />
                            </div>
                            <Button size="sm" type="submit" variant="outline" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200">
                                Senden & Erledigen
                            </Button>
                        </form>
                    </div>
                 ))}
                 {openInquiries.length === 0 && (
                     <p className="text-sm text-gray-500 italic">Keine offenen Anfragen. Gute Arbeit!</p>
                 )}
               </CardContent>
             </Card>
          )}

           {/* Prüfungen Widget - Nur anzeigen wenn Prüfungen vorhanden */}
           {nextExams.length > 0 && (
               <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <GraduationCap size={18} /> Anstehende Prüfungen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {nextExams.map((exam) => (
                      <HoverCard key={exam.id}>
                        <HoverCardTrigger asChild>
                            <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 cursor-help hover:bg-gray-50 p-2 rounded-md transition-colors">
                                <div className="space-y-1">
                                    <p className="font-medium leading-none">{exam.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(exam.date)}
                                    </p>
                                </div>
                                <Badge variant="secondary">Info</Badge>
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">{exam.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                    {exam.content}
                                </p>
                                <div className="flex items-center pt-2">
                                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                <span className="text-xs text-muted-foreground">
                                    {formatDate(exam.date)} • {exam.duration} Min. • {exam.location}
                                </span>
                                </div>
                            </div>
                            </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                </CardContent>
              </Card>
           )}


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
                        {course.room?.name || 'Kein Raum'} • {course.instructor}
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2">
                <Megaphone size={18} /> News
              </CardTitle>
              {user.role !== 'student' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Neue Ankündigung</DialogTitle>
                      <DialogDescription>
                        Erstelle eine News für alle Benutzer.
                      </DialogDescription>
                    </DialogHeader>
                    <form action={createAnnouncement} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Titel</Label>
                            <Input id="title" name="title" placeholder="Wichtiges Update" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Inhalt</Label>
                            <Input id="content" name="content" placeholder="Nachrichtentext..." required />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Veröffentlichen</Button>
                        </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((news) => (
                <div key={news.id} className="bg-gray-50 p-3 rounded-lg border">
                  <h4 className="font-semibold text-sm text-blue-700">{news.title}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{news.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-gray-400 font-medium">{news.author}</span>
                    <span className="text-[10px] text-gray-400">{formatDate(news.createdAt)}</span>
                  </div>
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
