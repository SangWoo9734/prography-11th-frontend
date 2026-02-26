"use client";

import { useState } from "react";
import { useAttendanceTable } from "@/app/hooks/useAttendanceTable";
import AttendanceSearchBar from "./AttendanceSearchBar";
import AttendanceTable from "./AttendanceTable";
import { fmt } from "@/app/utils/date";

export default function AttendanceView() {
  const [dateFrom, setDateFrom] = useState<string>(fmt(new Date()));
  const [dateTo, setDateTo] = useState<string>(fmt(new Date()));

  const { rows, isLoading, isFetching } = useAttendanceTable(dateFrom, dateTo);

  const handleSearch = (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
  };

  return (
    <div className="w-full flex flex-col flex-1 overflow-hidden">
      <div className="px-4 py-3 border-b-2 shrink-0 border-gray-300">
        <AttendanceSearchBar
          onSearch={handleSearch}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      </div>

      <div className="relative flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center py-16 text-gray-400">
            Loading...
          </div>
        ) : (
          <AttendanceTable rows={rows} />
        )}
        {!isLoading && isFetching && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
