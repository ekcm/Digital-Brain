import { Message } from './Message'
import { cn } from '@/lib/utils'
import { Source } from '@/store/useChatStore'

interface AssistantMessageProps {
  text: string
  className?: string
  sources?: Source[]
}

export function AssistantMessage({ text, className, sources }: AssistantMessageProps) {
  return (
    <div className="self-start">
      <Message
        text={text}
        sources={sources}
        className={cn('bg-neutral-50 text-neutral-900', className)}
      />
    </div>
  )
}
