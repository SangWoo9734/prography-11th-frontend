"use client";

import Button from "@/app/components/Button";
import { fmt } from "@/app/utils/date";
import { useState } from "react";

const getPresetRange = (type: "today" | "30d" | "1y") => {
  const today = new Date();
  if (type === "today") return { from: fmt(today), to: fmt(today) };
  if (type === "30d") {
    const from = new Date(today);
    from.setDate(today.getDate() - 29);
    return { from: fmt(from), to: fmt(today) };
  }
  const from = new Date(today);
  from.setFullYear(today.getFullYear() - 1);
  return { from: fmt(from), to: fmt(today) };
};

interface Props {
  onSearch: (dateFrom: string, dateTo: string) => void;
  dateFrom: string;
  dateTo: string;
}

const getActivePreset = (
  from: string,
  to: string,
): "today" | "30d" | "1y" | null => {
  const presets = ["today", "30d", "1y"] as const;
  for (const type of presets) {
    const range = getPresetRange(type);
    if (range.from === from && range.to === to) return type;
  }
  return null;
};

export default function AttendanceSearchBar({
  onSearch,
  dateFrom: committedFrom,
  dateTo: committedTo,
}: Props) {
  const [dateFrom, setDateFrom] = useState(committedFrom);
  const [dateTo, setDateTo] = useState(committedTo);

  const activePreset = getActivePreset(dateFrom, dateTo);

  const applyPreset = (type: "today" | "30d" | "1y") => {
    const { from, to } = getPresetRange(type);
    setDateFrom(from);
    setDateTo(to);
  };

  const handleSearch = () => {
    if (!dateFrom || !dateTo) return;
    onSearch(dateFrom, dateTo);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm font-bold text-gray-800 whitespace-nowrap shrink-0">
        검색 항목
      </p>

      <div className="flex items-center gap-1 shrink-0">
        <input
          type="date"
          className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <span className="text-gray-400">~</span>
        <input
          type="date"
          className="border border-gray-200 rounded-lg px-2 py-1 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="sm"
          variant={activePreset === "today" ? "primary" : "outline"}
          onClick={() => applyPreset("today")}
        >
          오늘
        </Button>
        <Button
          size="sm"
          variant={activePreset === "30d" ? "primary" : "outline"}
          onClick={() => applyPreset("30d")}
        >
          30일
        </Button>
        <Button
          size="sm"
          variant={activePreset === "1y" ? "primary" : "outline"}
          onClick={() => applyPreset("1y")}
        >
          1년
        </Button>
      </div>

      <Button
        size="sm"
        className="shrink-0 ml-auto"
        onClick={handleSearch}
        disabled={!dateFrom || !dateTo}
      >
        검색
      </Button>
    </div>
  );
}
