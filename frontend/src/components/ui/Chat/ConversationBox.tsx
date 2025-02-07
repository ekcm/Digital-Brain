import { useState } from 'react'
import { useChatStore } from '@/store/useChatStore'

interface Message {
  text: string
  type: 'user' | 'assistant'
}

export function ConversationBox() {
  const messages = useChatStore((state) => state.messages)

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            message.type === 'user'
              ? 'bg-lilac-default text-neutral-0 self-end'
              : 'bg-neutral-50 text-neutral-900 self-start'
          }`}
        >
          {message.text}
        </div>
      ))}
    </div>
  )
}
