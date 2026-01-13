import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { calculateDailyStats } from "@/lib/time-utils";
import { AttendanceCalendar } from "./calendar-view";
import { TimeStatsOverview } from "./stats-overview";

export default async function TimePage() {
  const user = await getCurrentUser();
  
  // Fetch ALL entries for the user to do client-side/server-side calculations properly
  // In a real scaled app, we would fetch only relevant month/year and aggregate in DB.
  // For MVP with ~1000 entries, fetching all is fine for now.
  const allEntries = user ? await prisma.timeEntry.findMany({
      where: { userId: user.id },
      orderBy: { clockIn: 'desc' }
  }) : [];
  
  const recentEntries = allEntries.slice(0, 5);
  const stats = calculateDailyStats(allEntries);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zeiterfassung</h1>
          <p className="text-gray-500">Deine Arbeitszeiten im Überblick.</p>
        </div>
        <form action="/api/time/export" method="GET">
             <Button className="gap-2" variant="outline">
                <Download size={16} /> Monatsbericht (CSV)
             </Button>
        </form>
      </div>

      <TimeStatsOverview stats={stats} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
             <AttendanceCalendar entries={allEntries} />
        </div>

        <Card>
            <CardHeader>
            <CardTitle>Letzte Buchungen</CardTitle>
            <CardDescription>Die letzten 5 Einträge deiner Stempeluhr.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Ort</TableHead>
                    <TableHead>Kommen</TableHead>
                    <TableHead>Gehen</TableHead>
                    <TableHead>Dauer</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {recentEntries.map((entry) => {
                    const durationMs = entry.clockOut ? (entry.clockOut.getTime() - entry.clockIn.getTime()) : 0;
                    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
                    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                    
                    return (
                        <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                            {entry.clockIn.toLocaleDateString('de-DE')}
                        </TableCell>
                        <TableCell>
                            {entry.location === 'REMOTE' 
                                ? <Badge variant="secondary">Telelearning</Badge> 
                                : <Badge variant="outline">Campus</Badge>
                            }
                        </TableCell>
                        <TableCell>
                            {entry.clockIn.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}
                        </TableCell>
                        <TableCell>
                            {entry.clockOut 
                                ? entry.clockOut.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'}) 
                                : "-"
                            }
                        </TableCell>
                        <TableCell>
                            {entry.clockOut ? (
                                <span className="font-mono text-xs">
                                    {durationHours}h {durationMinutes}m {Math.floor((durationMs % (1000 * 60)) / 1000)}s
                                </span>
                            ) : (
                                <Badge className="bg-blue-500">Aktiv</Badge>
                            )}
                        </TableCell>
                        </TableRow>
                    );
                })}
                {recentEntries.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 h-24">
                            Keine Zeiteinträge gefunden.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
