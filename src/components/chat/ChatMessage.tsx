import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={cn("flex gap-3 mb-4", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full",
          isUser ? "bg-primary" : "bg-muted"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Bot className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[80%] whitespace-pre-wrap",
          isUser
            ? "bg-gradient-primary text-primary-foreground shadow-elegant"
            : "bg-muted text-foreground"
        )}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;
