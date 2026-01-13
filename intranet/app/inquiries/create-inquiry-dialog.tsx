"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { createInquiry, getPotentialRecipients } from "@/lib/actions"; // We'll add getPotentialRecipients
import { useActionState } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";


type Recipient = {
  id: string;
  name: string;
  role: string;
  educationTrackId?: string | null;
  email: string;
}

type Track = {
  id: string;
  title: string;
}

export function CreateInquiryDialog({ variant = "default" }: { variant?: "default" | "sidebar" }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createInquiry, {
    success: false,
    message: "",
  });

  const [recipients, setRecipients] = useState<{students: Recipient[], teachers: Recipient[], admins: Recipient[], tracks: Track[]}>({ students: [], teachers: [], admins: [], tracks: [] });
  const [selectedCategory, setSelectedCategory] = useState("TEACHER");
  const [targetGroup, setTargetGroup] = useState("all"); // 'all', 'specific', 'track'
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  const [selectedTrackId, setSelectedTrackId] = useState("");

  useEffect(() => {
    // Fetch recipients when dialog opens
    if (open) {
        getPotentialRecipients().then((data) => {
            if (data) setRecipients(data as {students: Recipient[], teachers: Recipient[], admins: Recipient[], tracks: Track[]});
        });
    }
  }, [open]);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        setTimeout(() => {
            toast.success("Anfrage gesendet", {
            description: "Deine Anfrage wurde erfolgreich übermittelt.",
            });
            setOpen(false);
            // Reset fields
            setSelectedRecipientId("");
            setTargetGroup("all");
            setSelectedTrackId("");
        }, 0);
      } else {
        setTimeout(() => {
            toast.error("Fehler", {
            description: state.message,
            });
        }, 0);
      }
    }
  }, [state]);

  // Helpers to get list based on category
  const getSpecificOptions = () => {
      if (selectedCategory === 'TEACHER') return recipients.teachers;
      if (selectedCategory === 'ADMIN') return recipients.admins;
      if (selectedCategory === 'STUDENT') {
          if (targetGroup === 'track' && selectedTrackId) {
             return recipients.students.filter((s: Recipient) => s.educationTrackId === selectedTrackId);
          }
          return recipients.students;
      }
      return [];
  };

  const showEducationTrackOption = selectedCategory === 'STUDENT';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "sidebar" ? (
             <Button variant="ghost" className="w-full justify-end gap-2 text-current hover:bg-transparent px-0">
                Neue Anfrage <Plus className="h-4 w-4" />
             </Button>
        ) : (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Neue Anfrage
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Neue Anfrage stellen</DialogTitle>
            <DialogDescription>
              Stelle eine Frage an Lehrer, Administration oder Studenten.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Betreff</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Kurze Zusammenfassung"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Empfänger-Gruppe</Label>
              <Select 
                name="category" 
                required 
                defaultValue="TEACHER" 
                onValueChange={(val) => {
                    setSelectedCategory(val);
                    setTargetGroup("all"); 
                    setSelectedRecipientId("");
                    setSelectedTrackId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wähle einen Bereich" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEACHER">An Lehrer / Dozenten</SelectItem>
                  <SelectItem value="ADMIN">An Verwaltung / Admin</SelectItem>
                  {/* Only show "To Student" if user is NOT a student, but logic handled by backend mostly. 
                      However, if I'm a student, getPotentialRecipients returns empty students list so this is safe/useless but harmless.
                      Ideally hide if I'm student. Client side doesn't know my role easily here without props. 
                      Assuming safe enough as list will be empty.
                   */}
                   {recipients.students.length > 0 && (
                        <SelectItem value="STUDENT">An einen Studenten</SelectItem>
                   )}
                </SelectContent>
              </Select>
            </div>

             {/* Logic for specific selection */}
             <div className="grid gap-2">
                <Label>Spezifischer Empfänger?</Label>
                <Select 
                    value={targetGroup} 
                    onValueChange={(val) => {
                        setTargetGroup(val);
                        if (val !== 'track') setSelectedTrackId("");
                    }}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {selectedCategory === 'TEACHER' ? "Alle Lehrer (Allgemein)" : 
                             selectedCategory === 'ADMIN' ? "Verwaltung (Allgemein)" :
                             "Alle Studenten (Nicht empfohlen)"}
                        </SelectItem>
                        <SelectItem value="specific">Bestimmte Person auswählen</SelectItem>
                        {showEducationTrackOption && (
                            <SelectItem value="track">Nach Jahrgang filtern</SelectItem>
                        )}
                    </SelectContent>
                </Select>
             </div>

             {targetGroup === 'track' && (
                 <div className="grid gap-2">
                     <Label>Jahrgang wählen</Label>
                     <Select value={selectedTrackId} onValueChange={setSelectedTrackId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Jahrgang wählen" />
                        </SelectTrigger>
                        <SelectContent>
                            {recipients.tracks.map((t: Track) => (
                                <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                            ))}
                        </SelectContent>
                     </Select>
                 </div>
             )}
             
             {/* Hidden inputs for server action */}
             <input type="hidden" name="trackId" value={selectedTrackId} />

             {(targetGroup === 'specific' || (targetGroup === 'track' && selectedTrackId)) && (
                <div className="grid gap-2">
                    <Label htmlFor="recipientId">Person wählen</Label>
                    <Select name="recipientId" required value={selectedRecipientId} onValueChange={setSelectedRecipientId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Name wählen" />
                        </SelectTrigger>
                        <SelectContent>
                            {getSpecificOptions().map((u: Recipient) => (
                                <SelectItem key={u.id} value={u.id}>
                                    {u.name} ({u.role})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
             )}

            <div className="grid gap-2">
              <Label htmlFor="message">Nachricht</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Deine Frage im Detail..."
                required
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Absenden
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
