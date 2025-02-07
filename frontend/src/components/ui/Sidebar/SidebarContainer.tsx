'use client'

import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Chat } from "../Chat/Chat";

interface SidebarContainerProps {
    children?: React.ReactNode;
}
  
export function SidebarContainer({ children }: SidebarContainerProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    }

    return (
        <div className="flex">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            <Chat isCollapsed={isCollapsed} />
        </div>
    )
}