import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  shimmer?: boolean;
}

export const GradientText = ({
  children,
  className,
  animate = true,
  shimmer = false,
}: GradientTextProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span className={cn("relative inline-block", className)}>
      <motion.span
        initial={animate && !shouldReduceMotion ? { opacity: 0, y: 20 } : false}
        animate={animate ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-gradient-hero bg-clip-text text-transparent relative"
      >
        {children}
        
        {/* Shimmer overlay */}
        {shimmer && !shouldReduceMotion && (
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-clip-text"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear",
              repeatDelay: 2,
            }}
          />
        )}
      </motion.span>
    </span>
  );
};

export default GradientText;
