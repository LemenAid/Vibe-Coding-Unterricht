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

export default async function TimePage() {
  const entries = await getRecentEntries();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Zeiterfassung</h1>
        <p className="text-gray-500">Deine Arbeitszeiten im Überblick.</p>
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
                    <TableCell colSpan={4} className="text-center text-gray-500 h-24">
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
