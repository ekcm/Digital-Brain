import { Message } from './Message'
import { cn } from '@/lib/utils'

interface UserMessageProps {
  text: string
  className?: string
}

export function UserMessage({ text, className }: UserMessageProps) {
  return (
    <div className="self-end">
      <Message
        text={text}
        className={cn('bg-lilac-default text-neutral-0', className)}
      />
    </div>
  )
}
