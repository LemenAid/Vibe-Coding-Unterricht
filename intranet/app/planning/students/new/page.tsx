import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createStudentAction } from "@/lib/planning-actions";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewStudentPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/planning">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Neuen Schüler anlegen</h1>
          <p className="text-muted-foreground">Registrieren Sie einen neuen Teilnehmer für eine Umschulung.</p>
        </div>
      </div>

      <form action={createStudentAction} className="space-y-6 border p-6 rounded-lg bg-card">
        <div className="space-y-2">
          <Label htmlFor="name">Vollständiger Name</Label>
          <Input id="name" name="name" placeholder="Max Mustermann" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail Adresse</Label>
          <Input id="email" name="email" type="email" placeholder="max.mustermann@example.com" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="measureNumber">Maßnahmennummer</Label>
          <Input 
            id="measureNumber" 
            name="measureNumber" 
            placeholder="123/456/2024" 
            pattern="\d{3}/\d{3}/\d{4}"
            title="Format: 123/456/YYYY"
            required 
          />
          <p className="text-xs text-muted-foreground">Format: 123/456/YYYY</p>
        </div>

        <div className="space-y-2">
            <Label htmlFor="startTerm">Umschulungsstart (Kohorte)</Label>
            <Select name="startTerm" required>
            <SelectTrigger>
                <SelectValue placeholder="Wähle den Starttermin" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Winter 2026">Winter 2026</SelectItem>
                <SelectItem value="Sommer 2026">Sommer 2026</SelectItem>
                <SelectItem value="Winter 2025">Winter 2025</SelectItem>
                <SelectItem value="Sommer 2025">Sommer 2025</SelectItem>
                <SelectItem value="Winter 2024">Winter 2024</SelectItem>
                <SelectItem value="Sommer 2024">Sommer 2024</SelectItem>
            </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Diese Zuweisung beeinflusst den gesamten Kursplan des Schülers.</p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Link href="/planning">
            <Button variant="outline" type="button">Abbrechen</Button>
          </Link>
          <Button type="submit">Schüler anlegen</Button>
        </div>
      </form>
    </div>
  );
}
