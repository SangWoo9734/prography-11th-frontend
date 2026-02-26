import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAttendance } from "@/app/api/attendance";
import { getSessions } from "@/app/api/session";
import { fmt } from "@/app/utils/date";
import {
  PenaltyType,
  toApiFields,
  ERROR_MESSAGES,
} from "./attendanceFormUtils";

export function useAddAttendanceForm(
  memberId: number,
  onSuccess: () => void,
) {
  const queryClient = useQueryClient();

  const { today, thirtyDaysAgo } = useMemo(() => {
    const now = new Date();
    const past = new Date(now);
    past.setDate(now.getDate() - 29);
    return { today: fmt(now), thirtyDaysAgo: fmt(past) };
  }, []);

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", thirtyDaysAgo, today],
    queryFn: () => getSessions(thirtyDaysAgo, today),
  });

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [penaltyType, setPenaltyType] = useState<PenaltyType>("지각");
  const [lateMinutes, setLateMinutes] = useState(1);
  const [reason, setReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createAttendance({
        sessionId: sessionId!,
        memberId,
        ...toApiFields(penaltyType, lateMinutes, reason),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", memberId] });
      onSuccess();
    },
    onError: (err: Error & { code?: string }) => {
      setErrorMsg(ERROR_MESSAGES[err.code ?? ""] ?? err.message);
    },
  });

  const handleSubmit = () => {
    if (!sessionId) {
      setErrorMsg("세션을 선택해주세요.");
      return;
    }
    if (penaltyType === "기타" && !reason.trim()) {
      setErrorMsg("기타 사유를 입력해주세요.");
      return;
    }
    setErrorMsg("");
    mutate();
  };

  return {
    sessions,
    sessionId,
    setSessionId,
    penaltyType,
    setPenaltyType,
    lateMinutes,
    setLateMinutes,
    reason,
    setReason,
    errorMsg,
    isPending,
    handleSubmit,
  };
}
