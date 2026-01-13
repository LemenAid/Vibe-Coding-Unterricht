import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCourseAction } from "@/lib/planning-actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewCoursePage({ searchParams }: { searchParams: Promise<{ trackId?: string }> }) { // Updated to accept searchParams
  const user = await getCurrentUser();
  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    redirect("/");
  }

  const { trackId } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <Link href={trackId ? `/planning/${trackId}` : "/planning"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Neues Modul / Kurs anlegen</h1>
          <p className="text-muted-foreground">Erstellen Sie einen neuen Kursabschnitt für die Umschulung.</p>
        </div>
      </div>

      <form action={createCourseAction} className="space-y-6 border p-6 rounded-lg bg-card">
        {/* Hidden field to pass trackId if present */}
        {trackId && <input type="hidden" name="trackId" value={trackId} />}

        <div className="space-y-2">
          <Label htmlFor="title">Kurstitel / Modulname</Label>
          <Input id="title" name="title" placeholder="z.B. Web Development Grundlagen" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Beschreibung</Label>
          <Textarea id="description" name="description" placeholder="Inhalte und Ziele des Moduls..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Startdatum</Label>
            <Input id="startDate" name="startDate" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Enddatum</Label>
            <Input id="endDate" name="endDate" type="date" required />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link href={trackId ? `/planning/${trackId}` : "/planning"}>
            <Button variant="outline" type="button">Abbrechen</Button>
          </Link>
          <Button type="submit">Kurs erstellen</Button>
        </div>
      </form>
    </div>
  );
}
