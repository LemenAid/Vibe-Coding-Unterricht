import { getCurrentUser } from "@/lib/auth";
import { getStudentData, getTeacherData, getAdminData } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return <div>Nicht eingeloggt</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mein Profil</h1>
        <p className="text-gray-500">Persönliche Daten und Statistiken.</p>
      </div>

      {/* Basis Info Karte (Für alle) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-600">
              {user.name.charAt(0)}
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <Badge className="mt-2" variant="outline">{user.role.toUpperCase()}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Rollen-spezifische Inhalte */}
      {user.role === 'student' && <StudentProfile />}
      {user.role === 'staff' && <TeacherProfile />}
      {user.role === 'admin' && <AdminProfile />}
    </div>
  );
}

async function StudentProfile() {
  const data = await getStudentData();
  if (!data) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Leistungsübersicht</CardTitle>
          <CardDescription>Deine aktuellen Noten und Bewertungen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.grades.length > 0 ? (
              data.grades.map((grade) => (
                <div key={grade.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <span className="font-medium">{grade.subject}</span>
                  <Badge variant={grade.value <= 2.0 ? "default" : "secondary"}>
                    {grade.value.toFixed(1)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Keine Noten eingetragen.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anwesenheit & KPIs</CardTitle>
          <CardDescription>Deine Teilnahme am Unterricht</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{data.attendanceStats.attendanceRate}%</div>
              <div className="text-xs text-green-600 uppercase font-semibold">Anwesenheit</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{data.attendanceStats.missingDays}</div>
              <div className="text-xs text-red-600 uppercase font-semibold">Fehltage</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            Basis: {data.attendanceStats.totalDays} getrackte Tage
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function TeacherProfile() {
  const data = await getTeacherData();
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lehrkompetenzen & Fächer</CardTitle>
        <CardDescription>Aktive und inaktive Unterrichtsmodule</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {data.skills.length > 0 ? (
            data.skills.map((skill) => (
              <Badge 
                key={skill.id} 
                variant={skill.isActive ? "default" : "outline"}
                className={!skill.isActive ? "text-gray-400 border-dashed" : ""}
              >
                {skill.subject}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-gray-500">Keine Fächer hinterlegt.</p>
          )}
        </div>
        <p className="mt-4 text-xs text-gray-400">* Ausgegraute Fächer sind aktuell nicht aktiv.</p>
      </CardContent>
    </Card>
  );
}

async function AdminProfile() {
  const data = await getAdminData();
  if (!data) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Administrative Details</CardTitle>
          <CardDescription>Zuständigkeitsbereich und Abteilung</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
            <span className="text-sm font-medium text-slate-600">Abteilung</span>
            <span className="font-bold text-slate-900">{data.department}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Arbeitszeit-Statistik</CardTitle>
          <CardDescription>Erfasste Stunden gesamt</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 border rounded-lg">
            <div className="text-4xl font-extrabold text-blue-600">{data.workStats.totalHours} h</div>
            <div className="text-sm text-gray-500 mt-1">Gesamtarbeitszeit</div>
            <Separator className="my-4"/>
            <div className="text-xs text-gray-400">Basierend auf {data.workStats.entriesCount} Einträgen</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
