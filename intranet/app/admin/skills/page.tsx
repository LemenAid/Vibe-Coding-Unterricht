import { getCurrentUser } from "@/lib/auth";
import { getUnverifiedSkills, verifyTeacherSkill, deleteTeacherSkill } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AdminSkillsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
      redirect("/");
  }

  const unverifiedSkills = await getUnverifiedSkills();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kompetenz-Freigaben</h1>
        <p className="text-gray-500">Überprüfen und bestätigen Sie die Fähigkeiten der Dozenten.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ausstehende Anfragen</CardTitle>
          <CardDescription>
             {unverifiedSkills.length} offene Bestätigungen
          </CardDescription>
        </CardHeader>
        <CardContent>
            {unverifiedSkills.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    Keine ausstehenden Anfragen.
                </div>
            ) : (
                <div className="divide-y">
                    {unverifiedSkills.map((skill) => (
                        <div key={skill.id} className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                    {skill.user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium">{skill.user.name}</p>
                                    <p className="text-sm text-gray-500">{skill.user.email}</p>
                                </div>
                                <Badge variant="outline" className="ml-4">
                                    {skill.tag.name}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <form action={async () => {
                                    "use server";
                                    await verifyTeacherSkill(skill.id);
                                }}>
                                    <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                        <Check className="h-4 w-4 mr-1" />
                                        Bestätigen
                                    </Button>
                                </form>
                                <form action={async () => {
                                    "use server";
                                    await deleteTeacherSkill(skill.id);
                                }}>
                                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
