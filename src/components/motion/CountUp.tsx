import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export const CountUp = ({
  to,
  from = 0,
  duration = 2,
  delay = 0,
  suffix = "",
  prefix = "",
  className,
  decimals = 0,
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(from);
  
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        if (shouldReduceMotion) {
          setDisplayValue(to);
        } else {
          motionValue.set(to);
        }
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, to, delay, motionValue, shouldReduceMotion]);

  useEffect(() => {
    if (!shouldReduceMotion) {
      const unsubscribe = springValue.on("change", (latest) => {
        setDisplayValue(Number(latest.toFixed(decimals)));
      });
      return () => unsubscribe();
    }
  }, [springValue, decimals, shouldReduceMotion]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className={cn("tabular-nums", className)}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
};

export default CountUp;
