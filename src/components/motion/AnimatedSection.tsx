import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { scrollReveal, scrollViewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
}

const directionVariants = {
  up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
};

export const AnimatedSection = ({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: AnimatedSectionProps) => {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : directionVariants[direction];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2, margin: "-50px" }}
      variants={variants}
      transition={{ 
        duration: shouldReduceMotion ? 0.2 : 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={cn(className)}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;
