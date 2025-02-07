import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizontal } from 'lucide-react'
import { useState } from 'react'

export function ChatQueryBox() {
  const [query, setQuery] = useState('')
  const hasQuery = query.trim().length > 0

  return (
    <div className="mt-4 flex gap-2 border border-neutral-200 rounded-lg p-4">
      <Input 
        placeholder="Type your query here..." 
        className="flex-1 bg-neutral-50 p-4 rounded-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        className={`text-neutral-0 transition-colors duration-200 [&_svg]:text-neutral-0 hover:bg-none ${
          hasQuery ? 'bg-lilac-dark hover:bg-lilac-dark' : 'bg-lilac-default hover:bg-lilac-default'
        }`}
        disabled={!hasQuery}
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </div>
  )
}
