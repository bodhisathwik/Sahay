import { useRef, useState, useCallback, useEffect } from "react";

interface UseAutoScrollOptions {
  threshold?: number;
  smoothScroll?: boolean;
}

export const useAutoScroll = (
  dependencies: any[],
  options: UseAutoScrollOptions = {}
) => {
  const { threshold = 100, smoothScroll = true } = options;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isScrollingRef = useRef(false);

  const checkScrollPosition = useCallback(() => {
    if (!containerRef.current || isScrollingRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < threshold;
    
    setIsAtBottom(atBottom);
    setShowScrollButton(!atBottom);
  }, [threshold]);

  const scrollToBottom = useCallback((smooth = smoothScroll) => {
    if (!endRef.current) return;
    
    isScrollingRef.current = true;
    endRef.current.scrollIntoView({ 
      behavior: smooth ? "smooth" : "auto",
      block: "end"
    });
    
    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrollingRef.current = false;
      setShowScrollButton(false);
      setIsAtBottom(true);
    }, smooth ? 300 : 0);
  }, [smoothScroll]);

  // Auto-scroll when dependencies change if user is at bottom
  useEffect(() => {
    if (isAtBottom && containerRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        scrollToBottom(true);
      });
    }
  }, dependencies);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Throttle scroll checks
      requestAnimationFrame(checkScrollPosition);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [checkScrollPosition]);

  return {
    containerRef,
    endRef,
    showScrollButton,
    isAtBottom,
    scrollToBottom,
    checkScrollPosition
  };
};
