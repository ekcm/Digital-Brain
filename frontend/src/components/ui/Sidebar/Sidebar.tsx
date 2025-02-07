import { Columns2 } from 'lucide-react'

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar}: SidebarProps) {
    return (
        <div className={`fixed left-0 h-screen ${isCollapsed ? 'w-16' : 'w-1/4'} bg-neutral-50 border-r border-sidebar-border transition-all duration-300`}>
            {!isCollapsed && (
                <div className="absolute top-4 left-4 text-lg font-medium text-sidebar-text">
                    Sources
                </div>
            )}
            <button 
                className={`absolute top-4 ${isCollapsed ? 'left-4' : 'right-4'} text-sidebar-text hover:text-sidebar-hover transition-colors duration-200`}
                onClick={toggleSidebar}
            >
                <Columns2 />
            </button>
        </div>
    )
}