import { useEffect, useRef } from 'react'
import { useChatStore } from '@/store/useChatStore'
import { UserMessage } from './UserMessage'
import { AssistantMessage } from './AssistantMessage'
import { LoadingMessage } from './LoadingMessage'

export function ConversationBox() {
  const messages = useChatStore((state) => state.messages)
  const isLoading = useChatStore((state) => state.isLoading)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) =>
        message.type === 'user' ? (
          <UserMessage key={index} text={message.text} />
        ) : (
          <AssistantMessage key={index} text={message.text} sources={message.sources} />
        )
      )}
      {isLoading && <LoadingMessage />}
      <div ref={messagesEndRef} />
    </div>
  )
}
