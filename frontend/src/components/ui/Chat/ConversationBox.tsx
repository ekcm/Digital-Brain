import { useState } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { UserMessage } from './UserMessage'
import { AssistantMessage } from './AssistantMessage'
import { LoadingMessage } from './LoadingMessage'

interface Message {
  text: string
  type: 'user' | 'assistant'
}

export function ConversationBox() {
  const messages = useChatStore((state) => state.messages)
  const isLoading = useChatStore((state) => state.isLoading)

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) =>
        message.type === 'user' ? (
          <UserMessage key={index} text={message.text} />
        ) : (
          <AssistantMessage key={index} text={message.text} />
        )
      )}
      {isLoading && <LoadingMessage />}
    </div>
  )
}
