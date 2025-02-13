import { ChatQueryBox } from './QueryBox'
import { ConversationBox } from './ConversationBox'
import { useChatStore } from '@/store/useChatStore'
import { ChatHeader } from './ChatHeader'

interface ChatProps {
  isCollapsed: boolean
}

export function Chat({ isCollapsed }: ChatProps) {
  const clearMessages = useChatStore((state) => state.clearMessages)

  return (
    <main
      className={`flex-1 w-full h-screen ${isCollapsed ? 'pl-24' : 'pl-[25%]'} transition-all duration-300 p-4`}
    >
      {/* Chat Container */}
      <div className="h-full rounded-lg bg-neutral-0 p-6 shadow-sm flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0">
          <ChatHeader onClearMessages={clearMessages} />
        </div>

        {/* Scrollable Conversation Area */}
        <div className="flex-1 min-h-0 overflow-y-auto mb-4 [scrollbar-gutter:stable]">
          <div className="pr-4">
            <ConversationBox />
          </div>
        </div>

        {/* Fixed Chat Input */}
        <div className="flex-shrink-0">
          <ChatQueryBox />
        </div>
      </div>
    </main>
  )
}
