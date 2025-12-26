// ============================================================
// SAHAY Motion System - Premium Animation Library
// ============================================================
// GPU-safe animations using only opacity and transform
// Supports reduced-motion preferences
// ============================================================

import { Variants, Transition } from "framer-motion";

// ============================================================
// TRANSITION PRESETS
// ============================================================

export const transitions = {
  // Standard easing
  default: { duration: 0.4, ease: "easeOut" },
  fast: { duration: 0.2, ease: "easeOut" },
  slow: { duration: 0.6, ease: "easeOut" },
  
  // Spring animations
  spring: { type: "spring", stiffness: 300, damping: 25 },
  springBouncy: { type: "spring", stiffness: 400, damping: 20 },
  springSmooth: { type: "spring", stiffness: 200, damping: 30 },
  
  // Premium easing curves
  premium: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  smooth: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  
  // Page transitions
  pageEnter: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  pageExit: { duration: 0.3, ease: [0.4, 0, 1, 1] },
} as const;

// ============================================================
// ANIMATION VARIANTS
// ============================================================

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.default
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.default
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.default
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.default
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.default
  },
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.spring
  },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: transitions.premium
  },
};

// Slide animations
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.default
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.default
  },
};

export const slideInBottom: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.default
  },
};

// ============================================================
// STAGGER CONTAINERS
// ============================================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ============================================================
// STAGGER ITEMS
// ============================================================

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.default
  },
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: transitions.premium
  },
};

// ============================================================
// WORD-BY-WORD REVEAL
// ============================================================

export const wordRevealContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const wordRevealItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

// ============================================================
// CHARACTER-BY-CHARACTER REVEAL
// ============================================================

export const charRevealContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.2,
    },
  },
};

export const charRevealItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  },
};

// ============================================================
// HOVER ANIMATIONS
// ============================================================

export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -4, 
    scale: 1.02,
    transition: transitions.spring
  },
  tap: { scale: 0.98 }
};

export const hoverScale = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: transitions.spring
  },
  tap: { scale: 0.95 }
};

export const hoverGlow = {
  rest: { 
    scale: 1,
    boxShadow: "0 4px 20px -4px rgba(0, 0, 0, 0.1)"
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 20px 40px -12px rgba(var(--primary-rgb), 0.25)",
    transition: transitions.default
  },
};

// ============================================================
// CARD ANIMATIONS
// ============================================================

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: transitions.premium
  },
};

export const cardHover = {
  rest: { 
    y: 0, 
    scale: 1,
    boxShadow: "0 4px 20px -4px rgba(0, 0, 0, 0.08)"
  },
  hover: { 
    y: -8, 
    scale: 1.02,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    transition: transitions.spring
  },
};

// ============================================================
// MODAL / OVERLAY ANIMATIONS
// ============================================================

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 }
  },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: transitions.spring
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: transitions.fast
  },
};

// ============================================================
// LOADING / SKELETON ANIMATIONS
// ============================================================

export const shimmer: Variants = {
  initial: { x: "-100%" },
  animate: { 
    x: "100%",
    transition: { 
      repeat: Infinity, 
      duration: 1.5, 
      ease: "linear" 
    }
  },
};

export const pulse: Variants = {
  initial: { opacity: 0.5 },
  animate: { 
    opacity: 1,
    transition: { 
      repeat: Infinity, 
      repeatType: "reverse",
      duration: 1,
      ease: "easeInOut"
    }
  },
};

// ============================================================
// PAGE TRANSITIONS
// ============================================================

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: transitions.pageEnter
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: transitions.pageExit
  },
};

// ============================================================
// SCROLL-TRIGGERED VARIANTS
// ============================================================

export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

export const scrollRevealLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

export const scrollRevealRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Get reduced motion safe variants
export const getAccessibleVariants = (variants: Variants): Variants => {
  if (prefersReducedMotion()) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
    };
  }
  return variants;
};

// Generate stagger delay for index
export const getStaggerDelay = (index: number, baseDelay = 0.1): number => {
  return baseDelay * index;
};

// Viewport config for scroll-triggered animations
export const scrollViewport = {
  once: true,
  amount: 0.2,
  margin: "-50px",
};

export const scrollViewportEager = {
  once: true,
  amount: 0.1,
  margin: "-100px",
};
