interface ChatProps {
  isCollapsed: boolean
}

export function Chat({ isCollapsed }: ChatProps) {
  return (
    <main
      className={`flex-1 min-h-screen ${isCollapsed ? 'pl-24' : 'pl-[25%]'} transition-all duration-300 p-4`}
    >
      <div className="h-full rounded-lg bg-neutral-0 p-6 shadow-sm">
        <div className="text-lg font-medium">Chat Interface</div>
        <div className="h-px bg-neutral-200 my-4" />
        {/* Chat content will go here */}
      </div>
    </main>
  )
}
