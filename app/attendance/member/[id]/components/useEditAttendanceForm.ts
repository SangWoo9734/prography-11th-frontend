import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAttendance } from "@/app/api/attendance";
import { AttandanceInfo } from "@/app/types/attendance";
import {
  PenaltyType,
  toApiFields,
  toPenaltyType,
  ERROR_MESSAGES,
} from "./attendanceFormUtils";

export function useEditAttendanceForm(
  item: AttandanceInfo,
  memberId: number,
  onClose: () => void,
) {
  const queryClient = useQueryClient();

  const [penaltyType, setPenaltyType] = useState<PenaltyType>(
    toPenaltyType(item.status, item.reason),
  );
  const [lateMinutes, setLateMinutes] = useState(item.lateMinutes ?? 1);
  const [reason, setReason] = useState(
    item.status === "EXCUSED" && item.reason !== "조퇴"
      ? (item.reason ?? "")
      : "",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateAttendance(item.id, toApiFields(penaltyType, lateMinutes, reason)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", memberId] });
      onClose();
    },
    onError: (err: Error & { code?: string }) => {
      setErrorMsg(ERROR_MESSAGES[err.code ?? ""] ?? err.message);
    },
  });

  const handleSubmit = () => {
    if (penaltyType === "기타" && !reason.trim()) {
      setErrorMsg("기타 사유를 입력해주세요.");
      return;
    }
    setErrorMsg("");
    mutate();
  };

  return {
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
