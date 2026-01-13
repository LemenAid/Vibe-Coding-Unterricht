"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagSelector } from "./tag-selector";
import { TeacherSelector } from "./teacher-selector";
import { Trash2, UserPlus, Send, XCircle } from "lucide-react";
import { updateCourse, deleteCourse, inviteTeacherToCourse, getCourseInvitations } from "@/lib/actions"; // We will implement these actions
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

type CourseTag = {
    tag: {
        id: string;
        name: string;
    }
};

type TeacherSkill = {
    tag: {
        id: string;
        name: string;
    }
};

type Teacher = {
    id: string;
    name: string;
    teacherSkills?: TeacherSkill[];
};

type Course = {
    id: string;
    title: string;
    description: string | null;
    startDate: string | Date;
    endDate: string | Date;
    educationTrackId: string | null;
    tags: CourseTag[];
    teachers: Teacher[];
};

type Track = {
    id: string;
    title: string;
};

type Tag = {
    id: string;
    name: string;
};

type CourseEditDialogProps = {
    course: Course;
    tracks: Track[];
    allTags: Tag[];
};

import { TeacherSelectionProvider, useTeacherSelection } from "./teacher-context";

type Invitation = {
    id: string;
    status: string;
    teacher: {
        name: string;
    }
}

// Helper Component for Invitations
function InvitationList({ courseId }: { courseId: string }) {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    
    useEffect(() => {
        getCourseInvitations(courseId).then((data) => setInvitations(data as Invitation[]));
    }, [courseId]);

    if (invitations.length === 0) return null;

    return (
        <div className="mt-4 p-4 border rounded-md bg-white">
             <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Send size={14} /> Ausstehende Einladungen
             </h4>
             <ul className="space-y-2">
                 {invitations.map((inv) => (
                     <li key={inv.id} className="text-sm flex justify-between items-center bg-gray-50 p-2 rounded">
                         <span>{inv.teacher.name}</span>
                         <Badge variant={inv.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                            {inv.status === 'REJECTED' ? 'Abgelehnt' : 'Wartet...'}
                         </Badge>
                     </li>
                 ))}
             </ul>
        </div>
    )
}

// Wrapper for Submit Logic to handle Invitations vs Direct Assignment
function ActionButtons({ courseId, assignedTeacherId }: { courseId: string, assignedTeacherId?: string }) {
     const { selectedTeacherId } = useTeacherSelection();
     // If a teacher is selected in the dropdown that is DIFFERENT from the currently assigned one
     // We show "Invite" instead of just saving directly, or we handle it in the server action.
     // But here we want explicit "Invite" button maybe?
     // Actually, let's keep it simple: "Save Changes" updates everything.
     // BUT the requirement says: Change "Assign" button to "Invite".
     
     // In this dialog, we have a general "Save Changes" button for the whole form.
     // If we want to support invitation, we might need a specific button or handle it in updateCourse.
     // However, updateCourse usually does a direct connect.
     
     // Let's add a dedicated "Invite Selected Teacher" button if someone is selected but not assigned.
     
     const handleInvite = async (e: React.MouseEvent) => {
         e.preventDefault(); // Prevent form submit
         if (!selectedTeacherId) return;
         
         try {
             await inviteTeacherToCourse(courseId, selectedTeacherId);
             toast.success("Einladung gesendet!");
         } catch (e: unknown) {
            if (e instanceof Error) {
                toast.error(e.message);
            } else {
                toast.error("Ein unbekannter Fehler ist aufgetreten.");
            }
         }
     };

     if (selectedTeacherId && selectedTeacherId !== assignedTeacherId) {
         return (
             <div className="flex gap-2 mt-4">
                 <Button type="submit" className="flex-1" variant="secondary">
                    Speichern (Direkt zuweisen)
                 </Button>
                 <Button onClick={handleInvite} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="mr-2 h-4 w-4" /> Einladen
                 </Button>
             </div>
         )
     }

     return <Button type="submit" className="w-full mt-4">Änderungen speichern</Button>;
}

export function CourseEditDialog({ course, tracks, allTags }: CourseEditDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Extract initial tags from the first assigned teacher (if any) or existing course tags if we had them.
    // Assuming for now that course.teachers[0] represents the main teacher we want to show.
    // And assuming we might want to pre-fill tags based on that teacher's skills or course metadata if we had it.
    // Since we don't store "required tags" on the course directly in the schema shown so far, 
    // we might just start with an empty tag list OR try to infer from the assigned teacher.
    
    // Let's try to infer tags from the assigned teacher to be helpful
    const initialTeacher = course.teachers[0];
    
    // Use course tags if available, otherwise fall back to teacher's skill tags
    let initialTags: { id: string; name: string }[] = [];
    if (course.tags && course.tags.length > 0) {
        initialTags = course.tags.map((ct: CourseTag) => ct.tag);
    } else if (initialTeacher && initialTeacher.teacherSkills) {
        initialTags = initialTeacher.teacherSkills.map((ts: TeacherSkill) => ts.tag);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    Details & Bearbeiten
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <TeacherSelectionProvider initialTags={initialTags} initialTeacherId={initialTeacher?.id}>
                    <DialogHeader>
                        <div className="flex justify-between items-center pr-8">
                            <DialogTitle>Kurs bearbeiten</DialogTitle>
                        </div>
                        <DialogDescription>
                            Details ansehen, bearbeiten oder den Kurs löschen.
                        </DialogDescription>
                    </DialogHeader>

                    <form action={async (formData) => {
                        await updateCourse(formData);
                        setIsOpen(false);
                    }} className="space-y-6 mt-4">
                        <input type="hidden" name="courseId" value={course.id} />
                        
                        <div className="space-y-2">
                            <Label htmlFor="title">Kurstitel</Label>
                            <Input id="title" name="title" defaultValue={course.title} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Beschreibung</Label>
                            <Textarea id="description" name="description" defaultValue={course.description || ""} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Startdatum</Label>
                                <Input type="date" id="startDate" name="startDate" defaultValue={course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : ''} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">Enddatum</Label>
                                <Input type="date" id="endDate" name="endDate" defaultValue={course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : ''} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="track">Zuordnung (Umschulung)</Label>
                            <Select name="educationTrackId" defaultValue={course.educationTrackId || "none"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Wähle eine Umschulung (Optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Keine Zuordnung</SelectItem>
                                    {tracks.map((track) => (
                                        <SelectItem key={track.id} value={track.id}>
                                            {track.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-4 border p-4 rounded-md bg-slate-50">
                            <h3 className="font-medium text-sm">Qualifikationen & Dozenten</h3>
                            <p className="text-xs text-gray-500 mb-2">
                                Aktuelle Dozenten: {course.teachers.map((t: Teacher) => t.name).join(", ") || "Keine"}
                            </p>
                            <p className="text-xs text-amber-600 mb-4">
                                Hinweis: Änderungen hier überschreiben die bestehenden Zuweisungen.
                            </p>
                            <TagSelector allTags={allTags} />
                            <TeacherSelector />
                            
                            <InvitationList courseId={course.id} />
                        </div>

                        <ActionButtons courseId={course.id} assignedTeacherId={initialTeacher?.id} />

                        <Separator className="my-6" />

                        <div className="flex justify-end">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="gap-2">
                                        <Trash2 size={14} /> Kurs löschen
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                        <AlertDialogDescription className="space-y-2">
                                            <div className="flex items-center gap-2 text-red-600 font-bold bg-red-50 p-2 rounded">
                                                <XCircle className="h-5 w-5" />
                                                Warnung: Irreversible Aktion
                                            </div>
                                            <p>
                                                Diese Aktion kann nicht rückgängig gemacht werden. Der Kurs &quot;{course.title}&quot; und alle zugehörigen Daten werden dauerhaft gelöscht.
                                            </p>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                        <form action={async () => {
                                            await deleteCourse(course.id);
                                            setIsOpen(false);
                                        }}>
                                            <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700">Ja, Kurs löschen</AlertDialogAction>
                                        </form>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </form>
                </TeacherSelectionProvider>
            </DialogContent>
        </Dialog>
    );
}
