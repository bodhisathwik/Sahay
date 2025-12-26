import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, forwardRef } from "react";
import { cardVariants, transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  index?: number;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, delay = 0, index = 0, hoverEffect = true, onClick }, ref) => {
    const shouldReduceMotion = useReducedMotion();
    
    const computedDelay = delay + (index * 0.1);

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={shouldReduceMotion ? {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        } : cardVariants}
        transition={{ 
          ...transitions.premium,
          delay: computedDelay 
        }}
        whileHover={hoverEffect && !shouldReduceMotion ? { 
          y: -8, 
          scale: 1.02,
          transition: transitions.spring
        } : undefined}
        whileTap={hoverEffect ? { scale: 0.98 } : undefined}
        onClick={onClick}
        className={cn(
          "cursor-pointer",
          className
        )}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export default AnimatedCard;
