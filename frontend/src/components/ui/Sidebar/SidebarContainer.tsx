'use client'

import { Sidebar } from "./Sidebar";
import { useState } from "react";

interface SidebarContainerProps {
    children: React.ReactNode;
  }
  
  export function SidebarContainer({ children }: SidebarContainerProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
    }

    return (
      <div className="flex">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-80'} p-4 transition-all duration-300`}>
          {children}
        </main>
      </div>
    )
  }