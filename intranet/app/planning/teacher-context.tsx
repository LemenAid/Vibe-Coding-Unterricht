"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getQualifiedTeachers } from "@/lib/client-actions";

type Tag = { id: string; name: string };
// Define types that match the return value of getQualifiedTeachers and use in TeacherSelector
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

interface TeacherSelectionContextType {
  selectedTags: Tag[];
  addTag: (tag: Tag) => void;
  removeTag: (tagId: string) => void;
  qualifiedTeachers: Teacher[];
  loadingTeachers: boolean;
  selectedTeacherId: string | null;
  setSelectedTeacherId: (id: string | null) => void;
}

const TeacherSelectionContext = createContext<TeacherSelectionContextType | undefined>(undefined);

export function TeacherSelectionProvider({ 
    children, 
    initialTags = [], 
    initialTeacherId = null 
}: { 
    children: ReactNode, 
    initialTags?: Tag[], 
    initialTeacherId?: string | null 
}) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialTags);
  const [qualifiedTeachers, setQualifiedTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(initialTeacherId);

  const addTag = (tag: Tag) => setSelectedTags((prev) => [...prev, tag]);
  const removeTag = (tagId: string) => setSelectedTags((prev) => prev.filter((t) => t.id !== tagId));

  useEffect(() => {
    async function fetchTeachers() {
        if (selectedTags.length === 0) {
            setQualifiedTeachers([]);
            return;
        }

        setLoadingTeachers(true);
        try {
            // Fetch teachers who have skills matching ANY of the selected tags
            // We pass the tag IDs to the server action
            const tagIds = selectedTags.map(t => t.id);
            // Cast the result because server actions serialization can be tricky with specific Prisma types
            const teachers = await getQualifiedTeachers(tagIds) as unknown as Teacher[];
            setQualifiedTeachers(teachers);
        } catch (error) {
            console.error("Failed to fetch teachers", error);
        } finally {
            setLoadingTeachers(false);
        }
    }

    // Debounce slightly or just run
    const timeout = setTimeout(fetchTeachers, 300);
    return () => clearTimeout(timeout);
  }, [selectedTags]);

  return (
    <TeacherSelectionContext.Provider
      value={{
        selectedTags,
        addTag,
        removeTag,
        qualifiedTeachers,
        loadingTeachers,
        selectedTeacherId,
        setSelectedTeacherId
      }}
    >
      {children}
    </TeacherSelectionContext.Provider>
  );
}

export function useTeacherSelection() {
  const context = useContext(TeacherSelectionContext);
  if (context === undefined) {
    throw new Error("useTeacherSelection must be used within a TeacherSelectionProvider");
  }
  return context;
}
