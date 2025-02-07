import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/store/useChatStore'
import { SendHorizontal } from 'lucide-react'

export function ChatQueryBox() {
  const [query, setQuery] = useState('')
  const sendMessage = useChatStore((state) => state.sendMessage)
  const isLoading = useChatStore((state) => state.isLoading)
  const hasQuery = query.trim().length > 0

  const handleSend = () => {
    if (hasQuery && !isLoading) {
      sendMessage(query)
      setQuery('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="mt-4 flex gap-2 border border-neutral-200 rounded-lg p-4">
      <Input
        placeholder="Type your query here..."
        className="flex-1 bg-neutral-50 p-4 rounded-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        className={`text-neutral-0 transition-colors duration-200 [&_svg]:text-neutral-0 hover:bg-none ${
          hasQuery
            ? 'bg-lilac-dark hover:bg-lilac-dark'
            : 'bg-lilac-default hover:bg-lilac-default'
        }`}
        disabled={!hasQuery || isLoading}
        onClick={handleSend}
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </div>
  )
}
