import Button from "@/app/components/commons/Button";

export default function AttendanceSearchBar() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-5">
        <p className="text-lg font-bold mr-10">검색 항목</p>

        <div>
          <input type="date" />
          <span>~</span>
          <input type="date" />
        </div>

        <Button>오늘</Button>
        <Button>30일</Button>
        <Button>1년</Button>
      </div>
      <Button>검색</Button>
    </div>
  );
}
