import { Message } from './Message'
import { cn } from '@/lib/utils'

interface AssistantMessageProps {
  text: string
  className?: string
}

export function AssistantMessage({ text, className }: AssistantMessageProps) {
  return (
    <div className="self-start">
      <Message
        text={text}
        className={cn('bg-neutral-50 text-neutral-900', className)}
      />
    </div>
  )
}
