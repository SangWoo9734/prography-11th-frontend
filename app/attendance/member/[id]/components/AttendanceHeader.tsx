"use client";

import Button from "@/app/components/Button";
import { useModal } from "@/app/components/ModalProvider";

export default function AttendanceHeader() {
  const { toggleModal } = useModal();

  return (
    <div className="w-full px-4 py-3 border-b-2 border-gray-300 flex items-center justify-between">
      <h1 className="text-2xl">출결 관리 / 출결 내역 상세</h1>
      <Button onClick={toggleModal} size="sm">
        추가
      </Button>
    </div>
  );
}
