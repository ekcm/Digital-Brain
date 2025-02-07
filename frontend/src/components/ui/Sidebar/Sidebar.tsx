import { PanelLeft } from 'lucide-react';
import { Button} from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  return (
    <div className={`fixed left-0 h-screen p-4`}>
      <div
        className={`h-full ${isCollapsed ? 'w-16' : 'w-[calc(25vw-2rem)]'} bg-neutral-0 rounded-lg transition-all duration-300 p-6`}
      >
        <div
          className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}
        >
          {!isCollapsed && (
            <div className="text-lg font-medium text-sidebar-text">Sources</div>
          )}
          <Button
            className="text-sidebar-text hover:text-sidebar-hover transition-colors duration-200"
            variant="ghost"
            onClick={toggleSidebar}
          >
            <PanelLeft />
          </Button>
        </div>
        <div className="h-px bg-neutral-200 my-4" />
      </div>
    </div>
  )
}
