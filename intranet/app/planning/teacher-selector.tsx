"use client";

import { Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTeacherSelection } from "./teacher-context";

interface Tag {
    id: string;
    name: string;
}

interface TeacherSkill {
    id: string;
    tagId: string;
    tag: Tag;
}

interface Teacher {
    id: string;
    name: string;
    email: string;
    teacherSkills: TeacherSkill[];
}

export function TeacherSelector() {
    const { qualifiedTeachers, loadingTeachers, selectedTeacherId, setSelectedTeacherId, selectedTags } = useTeacherSelection() as {
        qualifiedTeachers: Teacher[];
        loadingTeachers: boolean;
        selectedTeacherId: string;
        setSelectedTeacherId: (id: string) => void;
        selectedTags: Tag[];
    };

    if (selectedTags.length === 0) {
        return <div className="text-sm text-gray-500 italic p-4">Wählen Sie Tags aus, um passende Dozenten zu finden.</div>;
    }

    if (loadingTeachers) {
        return <div className="text-sm text-gray-500 p-4">Suche qualifizierte Dozenten...</div>;
    }

    if (qualifiedTeachers.length === 0) {
        return <div className="text-sm text-red-500 p-4">Keine Dozenten mit verifizierten Skills für diese Tags gefunden.</div>;
    }

    return (
        <div className="space-y-4">
            <Label>Verfügbare Dozenten</Label>
            <RadioGroup 
                value={selectedTeacherId || ""} 
                onValueChange={setSelectedTeacherId}
                className="grid gap-4"
                name="teacherId" // Important for form submission
            >
                {qualifiedTeachers.map((teacher: Teacher) => {
                     // Check overlap between teacher skills and selected tags
                     const matchingSkills = teacher.teacherSkills.filter((s: TeacherSkill) => 
                        selectedTags.some((t: Tag) => t.id === s.tagId)
                     );
                     const missingTags = selectedTags.filter((t: Tag) => 
                        !teacher.teacherSkills.some((s: TeacherSkill) => s.tagId === t.id)
                     );

                    return (
                        <div key={teacher.id}>
                            <RadioGroupItem value={teacher.id} id={teacher.id} className="peer sr-only" />
                            <Label
                                htmlFor={teacher.id}
                                className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer"
                            >
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{teacher.name}</p>
                                            <p className="text-xs text-muted-foreground">{teacher.email}</p>
                                        </div>
                                    </div>
                                    {missingTags.length === 0 ? (
                                        <Badge className="bg-green-600 hover:bg-green-700">Perfekter Match</Badge>
                                    ) : (
                                        <Badge variant="secondary">{matchingSkills.length} / {selectedTags.length} Skills</Badge>
                                    )}
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {matchingSkills.map((skill: TeacherSkill) => (
                                        <Badge key={skill.id} variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                            <Check className="mr-1 h-3 w-3" />
                                            {skill.tag.name}
                                        </Badge>
                                    ))}
                                    {missingTags.map((tag: Tag) => (
                                         <Badge key={tag.id} variant="outline" className="border-red-100 bg-red-50 text-red-400 opacity-60 decoration-dashed">
                                            Fehlt: {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </Label>
                        </div>
                    );
                })}
            </RadioGroup>
        </div>
    );
}
