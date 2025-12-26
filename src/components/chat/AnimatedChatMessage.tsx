import { motion } from "framer-motion";
import { Bot, User, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface AnimatedChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  isCrisis?: boolean;
  index?: number;
}

// Detect crisis keywords in content
const detectCrisisKeywords = (text: string): boolean => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die', 'self-harm',
    'hurt myself', 'cutting', 'hopeless', 'no point', 'give up',
    'can\'t go on', 'better off dead', 'overdose'
  ];
  const lowerText = text.toLowerCase();
  return crisisKeywords.some(keyword => lowerText.includes(keyword));
};

const AnimatedChatMessage = ({ 
  role, 
  content, 
  isStreaming = false,
  isCrisis,
  index = 0 
}: AnimatedChatMessageProps) => {
  const isUser = role === "user";
  
  // Auto-detect crisis if not explicitly set
  const showCrisisIndicator = useMemo(() => {
    if (isCrisis !== undefined) return isCrisis;
    return !isUser && detectCrisisKeywords(content);
  }, [content, isCrisis, isUser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        ease: "easeOut",
        delay: index * 0.05
      }}
      className={cn("flex gap-3 mb-4", isUser && "flex-row-reverse")}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          delay: index * 0.05 + 0.1
        }}
        className={cn(
          "flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full shadow-md",
          isUser 
            ? "bg-gradient-primary" 
            : showCrisisIndicator 
              ? "bg-destructive/10 border border-destructive/30"
              : "bg-muted border border-border"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : showCrisisIndicator ? (
          <AlertTriangle className="h-5 w-5 text-destructive" />
        ) : (
          <Bot className="h-5 w-5 text-muted-foreground" />
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: isUser ? 10 : -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 + 0.15 }}
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[85%] md:max-w-[75%] whitespace-pre-wrap relative",
          isUser
            ? "bg-gradient-primary text-primary-foreground shadow-elegant"
            : showCrisisIndicator
              ? "bg-destructive/5 text-foreground border border-destructive/20"
              : "bg-muted text-foreground",
          isStreaming && "min-h-[40px]"
        )}
      >
        {content}
        
        {/* Streaming cursor */}
        {isStreaming && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 ml-1 bg-primary/50 rounded-sm"
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedChatMessage;
