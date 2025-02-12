import { PanelLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AddSourceButton } from '@/components/ui/AddSource/AddSourceButton'
import { useFilesStore } from '@/store/useFilesStore'
import { useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { config } from '@/config/env'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface SidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const { files, isLoading, fetchFiles } = useFilesStore()

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleDeleteAllSources = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/sources`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed with status: ${response.status}`);
      }
      
      toast.success('All sources deleted successfully');
      await fetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete sources');
    }
  };

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
        {!isCollapsed && <AddSourceButton />}
        {!isCollapsed && (
          <>
            <div className="mt-6 mb-2 flex items-center justify-between">
              <div className="text-sm font-medium text-neutral-600">
                Uploaded sources
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Trash2 className="w-4 h-4 text-neutral-400 hover:text-neutral-600 cursor-pointer" />
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Sources</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete all sources? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAllSources}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="rounded-lg bg-neutral-50 p-4 flex-1 overflow-auto">
              {isLoading ? (
                <div className="text-neutral-500">Loading files...</div>
              ) : files.length === 0 ? (
                <div className="text-neutral-500">No files found</div>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.key}
                      className="flex items-center p-2 rounded-md hover:bg-neutral-100 cursor-pointer"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <div className="truncate">{file.filename}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
