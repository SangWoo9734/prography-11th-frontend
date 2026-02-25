import AttendanceView from "./components/AttendanceView";

export default function AttendancePage() {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full px-4 py-3 border-b-2">
        <h1 className="text-2xl">출결 관리</h1>
      </div>
      <AttendanceView />
    </div>
  );
}
