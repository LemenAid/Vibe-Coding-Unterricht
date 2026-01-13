"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { assignStudentsToTrack } from "@/lib/actions";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

type Student = {
    id: string;
    name: string;
    email: string;
    // image?: string | null; // Removed
};

interface AssignStudentsDialogProps {
    trackId: string;
    trackTitle: string;
    availableStudents: Student[];
}

export function AssignStudentsDialog({ trackId, trackTitle, availableStudents }: AssignStudentsDialogProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const filteredStudents = availableStudents.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStudent = (studentId: string) => {
        setSelectedStudentIds(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSave = () => {
        startTransition(async () => {
            await assignStudentsToTrack(trackId, selectedStudentIds);
            setOpen(false);
            setSelectedStudentIds([]);
            router.refresh();
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                    Schüler hinzufügen
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Schüler zuweisen</DialogTitle>
                    <DialogDescription>
                        Fügen Sie Schüler zum Track &quot;{trackTitle}&quot; hinzu.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Suchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    
                    <div className="border rounded-md">
                        <div className="bg-muted/50 p-2 text-xs font-medium border-b flex justify-between">
                            <span>Name</span>
                            <span>{selectedStudentIds.length} ausgewählt</span>
                        </div>
                        <ScrollArea className="h-[200px]">
                            {filteredStudents.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                    Keine verfügbaren Schüler gefunden.
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {filteredStudents.map((student) => (
                                        <div key={student.id} className="flex items-center space-x-3 p-3 hover:bg-muted/30 transition-colors">
                                            <Checkbox 
                                                id={`student-${student.id}`} 
                                                checked={selectedStudentIds.includes(student.id)}
                                                onCheckedChange={() => handleToggleStudent(student.id)}
                                            />
                                            <div className="grid gap-0.5 leading-none cursor-pointer" onClick={() => handleToggleStudent(student.id)}>
                                                <Label 
                                                    htmlFor={`student-${student.id}`}
                                                    className="font-medium cursor-pointer"
                                                >
                                                    {student.name}
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    {student.email}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
                    <Button onClick={handleSave} disabled={isPending || selectedStudentIds.length === 0}>
                        {isPending ? "Speichert..." : "Hinzufügen"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
