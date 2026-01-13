import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const monthEntries = await prisma.timeEntry.findMany({
    where: {
      userId: user.id,
      clockIn: {
        gte: firstDayOfMonth,
        lte: lastDayOfMonth
      }
    },
    orderBy: { clockIn: 'asc' }
  });

  const headers = "Datum,Ort,Kommen,Gehen,Dauer (Min)\n";
  const rows = monthEntries.map(e => {
    const date = e.clockIn.toLocaleDateString('de-DE');
    const location = e.location;
    const start = e.clockIn.toLocaleTimeString('de-DE');
    const end = e.clockOut ? e.clockOut.toLocaleTimeString('de-DE') : "";
    const duration = e.duration || (e.clockOut ? Math.round((e.clockOut.getTime() - e.clockIn.getTime()) / 60000) : 0);
    return `${date},${location},${start},${end},${duration}`;
  }).join("\n");

  const csvContent = headers + rows;

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="Zeiterfassung_${now.getMonth() + 1}_${now.getFullYear()}.csv"`,
    },
  });
}
