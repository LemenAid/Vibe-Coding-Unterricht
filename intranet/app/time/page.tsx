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
import { getRecentEntries } from "@/lib/actions";
import { Button } from "@/components/ui/button"; // Added Button
import { Download } from "lucide-react"; // Added Download Icon
import { prisma } from "@/lib/prisma"; // Direct prisma access for CSV export logic
import { getCurrentUser } from "@/lib/auth";

export default async function TimePage() {
  const entries = await getRecentEntries();
  const user = await getCurrentUser();

  // CSV Export Logic (Inline Server Action for simplicity)
  async function exportTimeEntries() {
      "use server";
      const user = await getCurrentUser();
      if (!user) return;

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const monthEntries = await prisma.timeEntry.findMany({
          where: {
              userId: user.id,
              clockIn: {
                  gte: firstDayOfMonth,
                  lte: lastDayOfMonth
              }
          },
          orderBy: { clockIn: 'asc' }
      });

      // Simple CSV construction
      const headers = "Datum,Ort,Kommen,Gehen,Dauer (Min)\n";
      const rows = monthEntries.map(e => {
          const date = e.clockIn.toLocaleDateString('de-DE');
          const location = e.location;
          const start = e.clockIn.toLocaleTimeString('de-DE');
          const end = e.clockOut ? e.clockOut.toLocaleTimeString('de-DE') : "";
          const duration = e.duration || (e.clockOut ? Math.round((e.clockOut.getTime() - e.clockIn.getTime()) / 60000) : 0);
          return `${date},${location},${start},${end},${duration}`;
      }).join("\n");

      // In a real app, we would stream this or return a blob/url. 
      // Server Actions limit us from returning files directly easily without client handling.
      // For MVP, we will assume this action would trigger a download via a redirect to a route handler
      // OR we just log it for now as "Download feature prepared". 
      // ACTUALLY: Let's do a client-side download simulation or a route handler.
      // Since creating a new route handler is out of scope of "quick edits", 
      // let's print a message that this feature would download "Monthly_Report.csv".
      
      // Better approach for MVP within Server Action constraints:
      // Redirect to a specialized route handler is the clean way.
      // Let's just mock it visually or return the string to be handled? No, complex.
      
      // Let's implement the button to redirect to a new API route we will create.
  }

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
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.clockIn.toLocaleDateString('de-DE')}
                  </TableCell>
                  <TableCell>
                    {entry.location === 'REMOTE' 
                        ? <Badge variant="secondary">Telelearning / HomeOffice</Badge> 
                        : <Badge variant="outline">Campus / Büro</Badge>
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
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Abgeschlossen</Badge>
                    ) : (
                        <Badge className="bg-blue-500">Aktiv</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {entries.length === 0 && (
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
  );
}
