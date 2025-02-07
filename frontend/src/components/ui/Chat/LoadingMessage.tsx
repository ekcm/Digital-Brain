import { cn } from '@/lib/utils'

export function LoadingMessage({ className }: { className?: string }) {
  return (
    <div className="self-start">
      <div
        className={cn(
          'p-4 rounded-lg bg-neutral-50 text-neutral-900 flex gap-1 items-center',
          className
        )}
      >
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
        <div
          className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        />
        <div
          className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
          style={{ animationDelay: '0.4s' }}
        />
      </div>
    </div>
  )
}
