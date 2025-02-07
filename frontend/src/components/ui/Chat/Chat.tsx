import { Button } from '@/components/ui/button'
import { ChatQueryBox } from './QueryBox'
import { ConversationBox } from './ConversationBox'
import { useChatStore } from '@/store/useChatStore'

interface ChatProps {
  isCollapsed: boolean
}

export function Chat({ isCollapsed }: ChatProps) {
  const clearMessages = useChatStore((state) => state.clearMessages)

  return (
    <main
      className={`flex-1 min-h-screen ${isCollapsed ? 'pl-24' : 'pl-[25%]'} transition-all duration-300 p-4`}
    >
      <div className="h-full rounded-lg bg-neutral-0 p-6 shadow-sm flex flex-col">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium">Chat Interface</div>
          <Button variant="outline" onClick={clearMessages}>
            <span className="text-l">New Chat</span>
          </Button>
        </div>
        <div className="h-px bg-neutral-200 my-4" />
        <div className="flex-1 overflow-auto">
          <ConversationBox />
        </div>
        <div className="mt-auto">
          <ChatQueryBox />
        </div>
      </div>
    </main>
  )
}
