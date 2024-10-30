import { Message } from "ai/react";
import { useEffect, useRef } from "react";
interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const view = useRef<HTMLDivElement>(null);

  useEffect(() => {
    view.current!.scrollIntoView(false);
  }, [messages]);

  return (
    <div ref={view} className="w-full border-none flex flex-col gap-1">
      {messages.map((message: Message) => (
        <div key={message.id} className="flex flex-row ">
          {/* <span className="w-16 after:content-[':']">{message.role}</span> */}
          <span className="flex-1 backdrop-blur-sm bg-white/10 rounded-md text-lg p-1 ">
            {message.content}
          </span>
        </div>
      ))}
    </div>
  );
}
