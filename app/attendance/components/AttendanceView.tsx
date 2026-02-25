"use client";

import { useState } from "react";
import { useAttendanceTable } from "@/app/hooks/useAttendanceTable";
import AttendanceSearchBar from "./AttendanceSearchBar";
import AttendanceTable from "./AttendanceTable";
import { fmt } from "@/app/utils/date";

export default function AttendanceView() {
  const [dateFrom, setDateFrom] = useState<string>(fmt(new Date()));
  const [dateTo, setDateTo] = useState<string>(fmt(new Date()));

  const { rows, isLoading } = useAttendanceTable(dateFrom, dateTo);

  const handleSearch = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
  };

  return (
    <div className="w-full flex flex-col flex-1 overflow-scroll">
      <div className="px-4 py-3 border-b-2">
        <AttendanceSearchBar
          onSearch={handleSearch}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      </div>

      <div className="flex-1 overflow-scroll">
        {isLoading ? (
          <div className="flex justify-center py-16 text-gray-400">
            Loading...
          </div>
        ) : (
          <AttendanceTable rows={rows} />
        )}
      </div>
    </div>
  );
}
