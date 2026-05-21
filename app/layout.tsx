import "./globals.css";
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { BackgroundFX } from "@/components/BackgroundFX";

export const metadata: Metadata = {
  title: "NEXUS — Personal OS",
  description: "Your cinematic command center.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen relative overflow-x-hidden">
        <BackgroundFX />
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar />
            <main className="flex-1 px-4 md:px-8 pb-12 pt-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
