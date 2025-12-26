import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex gap-3 mb-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full bg-muted border border-border shadow-md"
      >
        <Bot className="h-5 w-5 text-muted-foreground" />
      </motion.div>
      
      <div className="rounded-2xl px-4 py-3 bg-muted min-h-[40px] flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{
              y: [0, -6, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
            className="w-2 h-2 rounded-full bg-primary/60"
          />
        ))}
      </div>
    </motion.div>
  );
};
