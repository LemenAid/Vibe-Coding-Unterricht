"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Clock, Target } from "lucide-react";

interface Stats {
    today: {
        minutes: number;
        ues: number;
        remainingUEs: number;
        progressPercent: number;
    };
    week: {
        minutes: number;
        ues: number;
        remainingUEs: number;
    };
    total: {
        uesDone: number;
        uesRemaining: number;
        progressPercent: number;
    };
}

export function TimeStatsOverview({ stats }: { stats: Stats }) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Today */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Heute
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.today.ues} UE</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.today.minutes} Minuten anwesend
                    </p>
                    <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Fortschritt</span>
                            <span className={stats.today.remainingUEs > 0 ? "text-red-500" : "text-green-600"}>
                                {stats.today.remainingUEs > 0 ? `Noch ${stats.today.remainingUEs} UE` : "Ziel erreicht"}
                            </span>
                        </div>
                        <Progress value={stats.today.progressPercent} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Week */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Diese Woche
                    </CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.week.ues} UE</div>
                    <p className="text-xs text-muted-foreground">
                        Aktuelle Woche gesamt
                    </p>
                    <div className="mt-4">
                         <p className="text-sm font-medium">
                            {stats.week.remainingUEs > 0 
                                ? <span className="text-orange-600">Offen: {stats.week.remainingUEs} UE</span>
                                : <span className="text-green-600">Wochenziel erreicht!</span>
                            }
                         </p>
                         <p className="text-xs text-gray-400 mt-1">Ziel: ~53.3 UE / Woche</p>
                    </div>
                </CardContent>
            </Card>

            {/* Total Course */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Gesamtkurs
                    </CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total.uesRemaining} UE</div>
                    <p className="text-xs text-muted-foreground">
                        Verbleibend bis Abschluss
                    </p>
                     <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Gesamtfortschritt</span>
                            <span>{stats.total.progressPercent.toFixed(1)}%</span>
                        </div>
                        <Progress value={stats.total.progressPercent} className="h-2" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
