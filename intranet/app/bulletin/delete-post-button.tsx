"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteBulletinPost } from "@/lib/actions";
import { useTransition } from "react";
import { toast } from "sonner";

export function DeletePostButton({ postId }: { postId: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50"
            disabled={isPending}
            onClick={() => {
                if (confirm("Möchtest du diesen Beitrag wirklich löschen?")) {
                    startTransition(async () => {
                        try {
                            await deleteBulletinPost(postId);
                            toast.success("Beitrag gelöscht");
                        } catch (error) {
                            console.error(error);
                            toast.error("Fehler beim Löschen des Beitrags");
                        }
                    });
                }
            }}
        >
            <Trash2 size={14} />
        </Button>
    );
}
