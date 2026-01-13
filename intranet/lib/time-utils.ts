import { isSameDay, format, eachDayOfInterval, startOfWeek, endOfWeek, isWeekend } from 'date-fns';


interface TimeEntry {
    id: string;
    userId: string;
    clockIn: Date;
    clockOut: Date | null;
    duration: number | null;
    location: string;
}

export function calculateDailyStats(entries: TimeEntry[], today: Date = new Date()) {
    // 1 UE = 45 Minuten
    const UE_DURATION_MINUTES = 45;
    const UE_PER_DAY = 10.666; // 8 Stunden = 480 Min / 45 Min = 10.66 UEs
    const MINUTES_PER_DAY = 8 * 60; // 480 minutes

    // Group entries by day
    const entriesByDay: Record<string, TimeEntry[]> = {};
    
    entries.forEach(entry => {
        const dateKey = format(entry.clockIn, 'yyyy-MM-dd');
        if (!entriesByDay[dateKey]) {
            entriesByDay[dateKey] = [];
        }
        entriesByDay[dateKey].push(entry);
    });

    // Helper to calculate duration for a list of entries in minutes (precise to seconds technically, but returning minutes float)
    const calculateTotalDuration = (dailyEntries: TimeEntry[]) => {
        return dailyEntries.reduce((acc, entry) => {
            const start = entry.clockIn.getTime();
            const end = entry.clockOut ? entry.clockOut.getTime() : new Date().getTime(); // If active, calculate until now
            return acc + (end - start);
        }, 0) / (1000 * 60); // Convert ms to minutes
    };

    // Calculate stats for today
    const todayKey = format(today, 'yyyy-MM-dd');
    const todayEntries = entriesByDay[todayKey] || [];
    const todayMinutes = calculateTotalDuration(todayEntries);
    const todayUEs = todayMinutes / UE_DURATION_MINUTES;
    const remainingUEsToday = Math.max(0, UE_PER_DAY - todayUEs);

    // Calculate stats for current week
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });
    
    let weekMinutes = 0;
    let expectedWeekMinutes = 0;

    weekDays.forEach(day => {
        if (isWeekend(day)) return; // Skip weekends for expected time
        if (day > today) {
             expectedWeekMinutes += MINUTES_PER_DAY; // Future days
             return;
        }

        const dateKey = format(day, 'yyyy-MM-dd');
        const dayEntries = entriesByDay[dateKey] || [];
        weekMinutes += calculateTotalDuration(dayEntries);
        
        // For past/current days, we expect full day unless it's today and day isn't over? 
        // Simplification: Expect 8h for every workday passed or today
        expectedWeekMinutes += MINUTES_PER_DAY; 
    });

    const weekUEs = weekMinutes / UE_DURATION_MINUTES;
    const expectedWeekUEs = expectedWeekMinutes / UE_DURATION_MINUTES;
    const remainingUEsWeek = Math.max(0, expectedWeekUEs - weekUEs); // Remaining to meet target

    // Total Course Stats (Mocked Start Date for context)
    // Assuming course started 3 months ago and ends in 3 months (6 months total)
    // In a real app, fetch course start/end dates
    
    // We can't easily calculate "Total Course Remaining" without knowing the full course schedule duration.
    // Based on user prompt: "wie lange die gesamte ausbildung noch UE's vor sich hat"
    // We'll mock a standard 6 month course = ~120 days * 8h = 960h = 1280 UEs
    const TOTAL_COURSE_UES = 1280;
    
    // Calculate total accumulated UEs ever
    const totalMinutesAllTime = entries.reduce((acc, entry) => {
         const start = entry.clockIn.getTime();
         const end = entry.clockOut ? entry.clockOut.getTime() : (isSameDay(entry.clockIn, new Date()) ? new Date().getTime() : entry.clockIn.getTime()); 
         return acc + (end - start);
    }, 0) / (1000 * 60);
    
    const totalUEsDone = totalMinutesAllTime / UE_DURATION_MINUTES;
    const totalUEsRemaining = Math.max(0, TOTAL_COURSE_UES - totalUEsDone);

    return {
        today: {
            minutes: Math.round(todayMinutes),
            ues: parseFloat(todayUEs.toFixed(1)),
            remainingUEs: parseFloat(remainingUEsToday.toFixed(1)),
            progressPercent: Math.min(100, (todayUEs / UE_PER_DAY) * 100)
        },
        week: {
            minutes: Math.round(weekMinutes),
            ues: parseFloat(weekUEs.toFixed(1)),
            remainingUEs: parseFloat(remainingUEsWeek.toFixed(1)), // Remaining for the *whole* week plan (including future days) or just catchup? Prompt implies "wv in der woche [noch zu erledigen]" -> usually means remaining target for the week
        },
        total: {
            uesDone: Math.round(totalUEsDone),
            uesRemaining: Math.round(totalUEsRemaining),
            progressPercent: Math.min(100, (totalUEsDone / TOTAL_COURSE_UES) * 100)
        }
    };
}
