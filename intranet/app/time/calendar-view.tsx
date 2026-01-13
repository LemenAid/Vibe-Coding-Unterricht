"use client";

import { useState } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface TimeEntry {
    id: string;
    clockIn: Date;
    clockOut: Date | null;
    duration: number | null; // in minutes if stored, else calculated
}

interface CalendarProps {
    entries: TimeEntry[];
}

export function AttendanceCalendar({ entries }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startDate = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), { weekStartsOn: 1 });
    const endDate = endOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), { weekStartsOn: 1 });
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    // Calculate daily duration helpers
    const getEntriesForDay = (date: Date) => {
        return entries.filter(e => isSameDay(e.clockIn, date));
    };

    const getDurationForDay = (date: Date) => {
        const dailyEntries = getEntriesForDay(date);
        const minutes = dailyEntries.reduce((acc, entry) => {
            const start = entry.clockIn.getTime();
            const end = entry.clockOut ? entry.clockOut.getTime() : (isToday(entry.clockIn) ? new Date().getTime() : entry.clockIn.getTime());
            return acc + (end - start);
        }, 0) / (1000 * 60);
        return Math.round(minutes);
    };

    // 8 hours = 480 minutes target
    const TARGET_MINUTES = 480; 

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg capitalize">
                    {format(currentDate, 'MMMM yyyy', { locale: de })}
                </h2>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={previousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-2 text-center text-xs font-medium text-gray-500">
                <div>Mo</div><div>Di</div><div>Mi</div><div>Do</div><div>Fr</div><div>Sa</div><div>So</div>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day, i) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const duration = getDurationForDay(day);
                    const hasEntries = duration > 0;
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                    
                    // Status Colors
                    let bgColor = "bg-transparent";
                    let textColor = isCurrentMonth ? "text-gray-900" : "text-gray-300";
                    let borderColor = "border-transparent";

                    if (isToday(day)) {
                        borderColor = "border-blue-500 font-bold";
                    }

                    if (hasEntries) {
                        if (duration >= TARGET_MINUTES) {
                            bgColor = "bg-green-100 text-green-900"; // Full day
                        } else if (duration > 0) {
                            bgColor = "bg-yellow-50 text-yellow-900"; // Partial day
                        }
                    } else if (isWeekend) {
                         bgColor = "bg-gray-50/50";
                         textColor = "text-gray-400";
                    }

                    return (
                        <HoverCard key={i}>
                            <HoverCardTrigger asChild>
                                <div 
                                    className={cn(
                                        "h-14 md:h-20 rounded-md border p-1 flex flex-col justify-between transition-colors text-xs cursor-default relative",
                                        bgColor,
                                        borderColor,
                                        !isCurrentMonth && !hasEntries && "opacity-50",
                                        "hover:border-blue-200"
                                    )}
                                >
                                    <span className={cn("text-right block", textColor)}>
                                        {format(day, 'd')}
                                    </span>
                                    
                                    {hasEntries && (
                                        <div className="flex items-center gap-1 font-semibold text-[10px] md:text-xs">
                                            <Clock className="w-3 h-3 opacity-70" />
                                            {Math.floor(duration / 60)}h {duration % 60}m
                                        </div>
                                    )}
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-60">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">{format(day, 'PPPP', { locale: de })}</h4>
                                    <div className="text-sm">
                                        Anwesend: <span className="font-mono">{Math.floor(duration / 60)}h {duration % 60}m</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {duration >= TARGET_MINUTES ? (
                                            <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Tagesziel erreicht</span>
                                        ) : isWeekend ? (
                                            <span>Wochenende</span>
                                        ) : hasEntries ? (
                                            <span className="text-yellow-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {Math.floor((TARGET_MINUTES - duration) / 60)}h {(TARGET_MINUTES - duration) % 60}m fehlen</span>
                                        ) : (
                                            <span>Keine Einträge</span>
                                        )}
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    );
                })}
            </div>
        </div>
    );
}
