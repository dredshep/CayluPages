import { ReactNode } from "react";
import MetaSidebar from "@/components/meta/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function MetaLayout({ children }: LayoutProps) {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 w-full">
      <MetaSidebar />
      {/* Content Area */}
      <div className="flex-1 p-10 dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}