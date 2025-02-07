import { cn } from '@/lib/utils'

interface MessageProps {
  text: string
  className?: string
}

export function Message({ text, className }: MessageProps) {
  return <div className={cn('p-4 rounded-lg', className)}>{text}</div>
}
