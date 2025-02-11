import { cn } from '@/lib/utils'
import { Source } from '@/store/useChatStore'

interface MessageProps {
  text: string
  className?: string
  sources?: Source[]
}

export function Message({ text, className, sources }: MessageProps) {
  // Function to replace [Source X] with numbered bubbles
  const formatTextWithSourceBubbles = (text: string) => {
    if (!sources) return text;

    // Create a mapping of source names to their index + 1
    const sourceMap = sources.reduce((acc, _, index) => {
      acc[`Source ${index + 1}`] = index + 1;
      return acc;
    }, {} as Record<string, number>);

    // Replace [Source X] with numbered bubbles
    const parts = text.split(/(\[Source \d+(?:, Source \d+)*\])/g);
    
    return parts.map((part, index) => {
      if (part.match(/\[Source \d+(?:, Source \d+)*\]/)) {
        // Extract source numbers
        const sourceNumbers = part
          .match(/\d+/g)!
          .map(num => parseInt(num))
          .filter(num => num <= sources.length);

        return (
          <span key={index} className="inline-flex gap-1 mx-1 items-center">
            {sourceNumbers.map((num, idx) => (
              <span
                key={idx}
                className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                title={`${sources[num-1].name} (${sources[num-1].file_name})`}
              >
                {num}
              </span>
            ))}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={cn('space-y-2 rounded-lg', className)}>
      <div className="p-4 rounded-lg whitespace-pre-wrap">
        {formatTextWithSourceBubbles(text)}
      </div>
      {sources && sources.length > 0 && (
        <div className="px-4 py-2 text-sm text-gray-500">
          <div className="font-semibold">Sources:</div>
          <ul className="list-none space-y-1">
            {sources.map((source, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600">
                  {index + 1}
                </span>
                <span>
                  {source.name} ({source.file_name})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
