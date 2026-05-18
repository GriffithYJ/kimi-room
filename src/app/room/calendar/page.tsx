import { RoomCalendar } from "@/components/calendar/RoomCalendar";
import { getTheme } from "@/lib/day-theme";

export const dynamic = "force-dynamic";

// V2 /room/calendar · canon RoomCalendar restored · localStorage source of truth
// (canon V1 had Prisma DB sync · V2 strip · /api/calendar/* deleted, lib stubs
// return null/empty so RoomCalendar local path 走通).

export default async function RoomCalendarPage() {
  const initialTheme = await getTheme();
  return <RoomCalendar initialTheme={initialTheme} />;
}
