import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useChatStore } from '@/store/useChatStore'

interface Message {
  text: string
  type: 'user' | 'assistant'
}

interface QueryBoxProps {
}

export function ChatQueryBox() {
  const [query, setQuery] = useState('')
  const hasQuery = query.trim().length > 0
  const addMessage = useChatStore((state) => state.addMessage)

  async function sendQuery(query: string) {
    try {
      addMessage({ text: query, type: 'user' })
      setQuery('') // Clear input after sending
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="mt-4 flex gap-2 border border-neutral-200 rounded-lg p-4">
      <Input 
        placeholder="Type your query here..." 
        className="flex-1 bg-neutral-50 p-4 rounded-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && hasQuery) {
            sendQuery(query)
          }
        }}
      />
      <Button
        className={`text-neutral-0 transition-colors duration-200 [&_svg]:text-neutral-0 hover:bg-none ${
          hasQuery ? 'bg-lilac-dark hover:bg-lilac-dark' : 'bg-lilac-default hover:bg-lilac-default'
        }`}
        disabled={!hasQuery}
        onClick={() => hasQuery && sendQuery(query)}
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </div>
  )
}
