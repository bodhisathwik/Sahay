import { Bot } from "lucide-react";

const SkeletonChatBubble = () => {
  return (
    <div className="flex gap-3 mb-4">
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-muted">
        <Bot className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="rounded-2xl px-4 py-3 max-w-[80%] bg-muted">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonChatBubble;
