"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../assets/logo.png";
import { cn } from "../utils/cn";

const NAV_LINKS = [
  { href: "/user", label: "회원 관리" },
  { href: "/attendance", label: "출결 관리" },
  { href: "/session", label: "세션 관리" },
];

export default function SideBar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-full w-44 shrink-0 flex-col p-3 border-r-2 border-gray-300">
      <Link href="/user" className="mb-4 inline-block">
        <Image src={logo} alt="logo" width={80} height={30} />
      </Link>
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "whitespace-nowrap px-2 py-1.5 rounded text-sm transition-colors",
              pathname.startsWith(href)
                ? "bg-gray-100 font-medium text-gray-900"
                : "text-gray-600 hover:bg-gray-100",
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
