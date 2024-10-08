"use client";
import Header from "@/features/Dashboard/Header";
import Sidebar from "@/features/Dashboard/Sidebar";
import ProtectRoute from "@/features/ProtectRoute";
import { Suspense, useState } from "react";
import Loading from "../loading";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [openSidebar, setOpenSidebar] = useState(true);

  return (
    <ProtectRoute>
      <Suspense fallback={<Loading />}>
        <div className="flex h-screen bg-gray-100">
          <Sidebar openSidebar={openSidebar} />
          <div className="flex flex-col flex-1 overflow-y-auto bg-surface-background">
            <Header setOpenSidebar={setOpenSidebar} />
            <div className="py-4 px-11">{children}</div>
          </div>
        </div>
      </Suspense>
    </ProtectRoute>
  );
}
