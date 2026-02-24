import Button from "@/app/components/commons/Button";

export default function UserSearchBar() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-5">
        <p className="text-lg font-bold mr-10">검색 항목</p>
        <select>
          <option>사용자명</option>
          <option>팀</option>
          <option>포지션</option>
        </select>
        <input type="text" className="w-80" />
      </div>
      <Button>검색</Button>
    </div>
  );
}
