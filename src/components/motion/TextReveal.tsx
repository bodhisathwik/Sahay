import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { wordRevealContainer, wordRevealItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  delay?: number;
  staggerDelay?: number;
  gradient?: boolean;
}

export const TextReveal = ({
  text,
  className,
  as: Component = "span",
  delay = 0,
  staggerDelay = 0.08,
  gradient = false,
}: TextRevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const words = useMemo(() => text.split(" "), [text]);

  if (shouldReduceMotion) {
    return (
      <Component className={cn(gradient && "bg-gradient-hero bg-clip-text text-transparent", className)}>
        {text}
      </Component>
    );
  }

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={cn(
        "inline-flex flex-wrap",
        gradient && "bg-gradient-hero bg-clip-text text-transparent",
        className
      )}
      aria-label={text}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordRevealItem}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default TextReveal;
