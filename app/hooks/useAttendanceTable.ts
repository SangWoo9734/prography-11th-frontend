import { useQuery, useQueries } from "@tanstack/react-query";
import { getMembers } from "../api/user";
import { getSessions } from "../api/session";
import { getAttendanceBySession } from "../api/attendance";
import { AttendanceRow } from "../types/attendance";

export function useAttendanceTable(
  dateFrom: string | null,
  dateTo: string | null,
) {
  const enabled = !!dateFrom && !!dateTo;

  const membersQuery = useQuery({
    queryKey: ["members", "all"],
    queryFn: () => getMembers({ page: 0, size: 1000 }),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const sessionsQuery = useQuery({
    queryKey: ["sessions", dateFrom, dateTo],
    queryFn: () => getSessions(dateFrom!, dateTo!),
    enabled,
  });

  const attendanceQueries = useQueries({
    queries: (sessionsQuery.data ?? []).map((session) => ({
      queryKey: ["attendance", "session", session.id],
      queryFn: () => getAttendanceBySession(session.id),
      enabled: !!sessionsQuery.data,
    })),
  });

  const isLoading =
    membersQuery.isLoading ||
    sessionsQuery.isLoading ||
    attendanceQueries.some((q) => q.isLoading);

  const memberMap = new Map(
    membersQuery.data?.content.map((m) => [
      m.id,
      { name: m.name, teamName: m.teamName, memberId: m.id },
    ]) ?? [],
  );

  const rows: AttendanceRow[] = [];
  if (!isLoading && sessionsQuery.data) {
    sessionsQuery.data.forEach((session, i) => {
      const attendances = attendanceQueries[i]?.data?.attendances ?? [];
      attendances.forEach((att) => {
        const member = memberMap.get(att.memberId);
        rows.push({
          memberId: member?.memberId ?? 0,
          name: member?.name ?? "-",
          teamName: member?.teamName ?? "-",
          date: session.date,
          status: att.status,
          lateMinutes: att.lateMinutes,
          penaltyAmount: att.penaltyAmount,
        });
      });
    });
  }

  return { rows, isLoading, enabled };
}
