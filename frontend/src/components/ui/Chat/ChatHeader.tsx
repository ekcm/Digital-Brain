import { Button } from '@/components/ui/button'

interface ChatHeaderProps {
  onClearMessages: () => void
}

export function ChatHeader({ onClearMessages }: ChatHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-lg font-medium">Chat Interface</div>
        <Button variant="outline" onClick={onClearMessages}>
          <span className="text-l">New Chat</span>
        </Button>
      </div>
      <div className="h-px bg-neutral-200 my-4" />
    </>
  )
}
