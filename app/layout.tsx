import type { Metadata } from "next";
import "./globals.css";
import SideBar from "./components/Sidebar";
import { QueryProvider } from "./components/QueryProvider";

export const metadata: Metadata = {
  title: "Prography 11th Admin",
  description: "프로그라피 11기 어드민 출결 관리 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-hidden">
        <div className="h-full flex">
          <SideBar />
          <main className="flex-1 min-w-0 h-full overflow-hidden">
            <QueryProvider>{children}</QueryProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
