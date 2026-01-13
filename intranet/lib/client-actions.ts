"use server";

import { prisma } from "@/lib/prisma";

export async function getQualifiedTeachers(tagIds: string[]) {
    if (tagIds.length === 0) return [];

    // Find teachers who have a VERIFIED skill matching ANY of the tagIds
    // We want to return teachers, and maybe annotate which skills matched
    const teachers = await prisma.user.findMany({
        where: {
            role: { in: ['staff', 'teacher', 'admin'] }, // Assuming staff/admin can teach
            teacherSkills: {
                some: {
                    tagId: { in: tagIds },
                    isVerified: true
                }
            }
        },
        include: {
            teacherSkills: {
                where: { isVerified: true },
                include: { tag: true }
            }
        }
    });

    // We could sort them by how many matching tags they have
    return teachers.sort((a, b) => {
        const aMatches = a.teacherSkills.filter(s => tagIds.includes(s.tagId)).length;
        const bMatches = b.teacherSkills.filter(s => tagIds.includes(s.tagId)).length;
        return bMatches - aMatches;
    });
}
