"use client";

import Button from "@/app/components/Button";
import { SearchType } from "@/app/api/user";
import { useState } from "react";

const SEARCH_OPTIONS: { label: string; value: SearchType }[] = [
  { label: "사용자명", value: "name" },
  { label: "팀", value: "teamName" },
  { label: "포지션", value: "partName" },
];

interface Props {
  onSearch: (searchType: SearchType, searchValue: string) => void;
  onReset: () => void;
}

export default function UserSearch({ onSearch, onReset }: Props) {
  const [searchType, setSearchType] = useState<SearchType>("name");
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (!searchValue.trim()) {
      onReset();
      return;
    }
    onSearch(searchType, searchValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex items-center gap-3">
      <select
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer"
        value={searchType}
        onChange={(e) => setSearchType(e.target.value as SearchType)}
      >
        {SEARCH_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-gray-400"
        placeholder="검색어를 입력하세요"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button size="sm" onClick={handleSearch}>
        검색
      </Button>
      {searchValue && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setSearchValue("");
            onReset();
          }}
        >
          초기화
        </Button>
      )}
    </div>
  );
}
