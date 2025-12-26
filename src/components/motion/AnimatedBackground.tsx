import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  className?: string;
  variant?: "gradient" | "orbs" | "mesh";
}

export const AnimatedBackground = ({
  className,
  variant = "gradient",
}: AnimatedBackgroundProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={cn("absolute inset-0 -z-10 bg-gradient-subtle", className)} />
    );
  }

  if (variant === "orbs") {
    return (
      <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
        {/* Primary orb */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: ["-10%", "10%", "-10%"],
            y: ["-10%", "20%", "-10%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "-20%", left: "-10%" }}
        />
        
        {/* Secondary orb */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full bg-secondary/20 blur-3xl"
          animate={{
            x: ["10%", "-10%", "10%"],
            y: ["20%", "-10%", "20%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ bottom: "-20%", right: "-10%" }}
        />

        {/* Accent orb */}
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full bg-accent/15 blur-3xl"
          animate={{
            x: ["-5%", "15%", "-5%"],
            y: ["10%", "-10%", "10%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ top: "40%", right: "20%" }}
        />
      </div>
    );
  }

  if (variant === "mesh") {
    return (
      <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(at 20% 30%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
              radial-gradient(at 80% 70%, hsl(var(--secondary) / 0.15) 0%, transparent 50%),
              radial-gradient(at 50% 50%, hsl(var(--accent) / 0.1) 0%, transparent 60%)
            `,
          }}
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  // Default gradient
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: "200% 200%" }}
      />
    </div>
  );
};

export default AnimatedBackground;
