import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.png";

export default function SideBar() {
  return (
    <div className="h-full w-40 flex flex-col p-3 border-r-2">
      <Link href="/user">
        <Image src={logo} alt="logo" width={80} height={30} className="mb-4" />
      </Link>
      <Link href="/user">회원 관리</Link>
      <Link href="/attendance">출결 관리</Link>
      <Link href="/session">세션 관리</Link>
    </div>
  );
}
