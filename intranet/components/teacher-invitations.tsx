"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { respondToCourseInvitation } from "@/lib/actions";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";

interface Invitation {
  id: string;
  status: string;
  course: {
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
  };
}

export function TeacherInvitations({ invitations }: { invitations: Invitation[] }) {
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  if (invitations.length === 0) return null;

  const handleRespond = async (invitationId: string, accept: boolean) => {
    setLoadingIds((prev) => new Set(prev).add(invitationId));
    try {
      await respondToCourseInvitation(invitationId, accept);
      toast.success(accept ? "Kurs angenommen!" : "Kurs abgelehnt.");
    } catch {
      toast.error("Fehler beim Antworten auf die Einladung.");
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(invitationId);
        return next;
      });
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
            📬 Offene Kurseinladungen
            <Badge variant="secondary" className="ml-auto">{invitations.length}</Badge>
        </CardTitle>
        <CardDescription>
          Du wurdest eingeladen, folgende Kurse zu unterrichten.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {invitations.map((inv) => (
          <div
            key={inv.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-card rounded-lg border shadow-sm"
          >
            <div className="mb-4 sm:mb-0">
              <h4 className="font-semibold">{inv.course.title}</h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(inv.course.startDate), "dd. MMM yyyy", { locale: de })} -{" "}
                {format(new Date(inv.course.endDate), "dd. MMM yyyy", { locale: de })}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-none border-red-200 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30"
                onClick={() => handleRespond(inv.id, false)}
                disabled={loadingIds.has(inv.id)}
              >
                {loadingIds.has(inv.id) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Ablehnen
                  </>
                )}
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={() => handleRespond(inv.id, true)}
                disabled={loadingIds.has(inv.id)}
              >
                {loadingIds.has(inv.id) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Annehmen
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
