import { PanelLeft } from 'lucide-react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface SidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
}

async function addSource() {
  try {
    toast.success('Source added')
  } catch (error) {
    toast.error('Something went wrong')
  }
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  return (
    <div className={`fixed left-0 h-screen p-4 flex flex-col`}>
      <div
        className={`h-full ${isCollapsed ? 'w-16' : 'w-[calc(25vw-2rem)]'} bg-neutral-0 rounded-lg transition-all duration-300 p-6 flex flex-col`}
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
        {!isCollapsed && (
          <Button
            className="rounded-lg bg-gradient-peach h-16 w-full text-neutral-0 flex gap-2 items-center justify-center"
            onClick={addSource}
          >
            <Plus className="text-neutral-0" />
            Add Source
          </Button>
        )}
        {!isCollapsed && (
          <div className="mt-4 rounded-lg bg-neutral-50 p-4 flex-1 overflow-auto">
            {/* Content will go here */}
          </div>
        )}
      </div>
    </div>
  )
}
