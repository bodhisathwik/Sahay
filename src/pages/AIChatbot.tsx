import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedChatMessage from "@/components/chat/AnimatedChatMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { SummaryModal } from "@/components/chat/SummaryModal";
import { CrisisResources } from "@/components/chat/CrisisResources";
import { QuickActions } from "@/components/chat/QuickActions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, ArrowDown, Heart, Shield } from "lucide-react";
import { runGeminiChat } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCrisisDetection } from "@/hooks/useCrisisDetection";
import { useAutoScroll } from "@/hooks/useAutoScroll";

interface Message {
  role: "user" | "assistant";
  content: string;
  isCrisis?: boolean;
}

const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! 🙏 I'm SAHAY, your wellness companion. I'm here to listen and support you through whatever you're experiencing—be it stress, anxiety, exam pressure, or just needing someone to talk to.\n\nHow are you feeling today, yaar?",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summary, setSummary] = useState<{ reflection: string; actionItems: string[] } | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const { toast } = useToast();
  const { user } = useAuth();
  const { crisisState, showResources, checkForCrisis, dismissResources } = useCrisisDetection();
  const { containerRef, endRef, showScrollButton, scrollToBottom } = useAutoScroll([messages]);

  const handleQuickAction = useCallback((message: string) => {
    setInput(message);
    setShowQuickActions(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };

    // Check for crisis keywords in user message
    const crisis = checkForCrisis(input);

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShowQuickActions(false);

    // Scroll to bottom immediately
    requestAnimationFrame(() => scrollToBottom(false));

    try {
      const data = await runGeminiChat({
        type: "chat",
        payload: {
          messages: [...messages, userMessage],
          crisisDetected: crisis.isDetected,
          crisisSeverity: crisis.severity
        }
      });

      if (!data.success) throw new Error(data.error);

      if (data?.success && data?.data?.reply) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.data.reply,
          isCrisis: crisis.severity === "high" || crisis.severity === "moderate"
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage = error.message?.includes("429")
        ? "We're experiencing high demand. Please try again in a moment."
        : "I'm having trouble connecting right now. Please try again.";

      toast({
        variant: "destructive",
        title: "Connection Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (messages.length < 3) {
      toast({
        title: "Not enough messages",
        description: "Have a bit more conversation before getting a summary.",
      });
      return;
    }

    setSummaryLoading(true);
    setSummaryOpen(true);

    try {
      const data = await runGeminiChat({
        type: "summarize",
        payload: { messages }
      });

      if (!data.success) throw new Error(data.error);

      if (data?.success && data?.data) {
        setSummary({
          reflection: data.data.reflection || "No reflection available",
          actionItems: data.data.actionItems || []
        });
      }
    } catch (error) {
      console.error("Summary error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary. Please try again.",
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <Header />

      <main className="flex-1 container py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Heart className="h-8 w-8 text-primary fill-primary/20" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  AI Companion
                </span>
              </h1>
            </div>
            <p className="text-muted-foreground">
              A safe, judgment-free space to talk about anything • <span className="text-primary">सहय</span>
            </p>
          </motion.div>

          {/* Chat Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="shadow-elegant border-border/50 overflow-hidden backdrop-blur-sm bg-card/95">
              <div className="p-4 md:p-6 space-y-4">
                {/* Actions Bar */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Anonymous & Safe</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSummarize}
                    disabled={messages.length < 3}
                    className="gap-2 hover:shadow-md transition-all"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Summarize</span>
                  </Button>
                </div>

                {/* Crisis Resources */}
                <CrisisResources
                  show={showResources}
                  onDismiss={dismissResources}
                />

                {/* Chat Container - Fixed Height */}
                <div className="relative">
                  <div
                    ref={containerRef}
                    role="log"
                    aria-live="polite"
                    aria-atomic="false"
                    className="h-[55vh] md:h-[50vh] lg:h-[55vh] overflow-y-auto pr-2 scroll-smooth overscroll-contain"
                  >
                    {/* Quick Actions */}
                    <AnimatePresence>
                      {showQuickActions && messages.length === 1 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <QuickActions
                            onSelect={handleQuickAction}
                            disabled={isLoading}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Messages */}
                    <AnimatePresence mode="popLayout">
                      {messages.map((message, index) => (
                        <AnimatedChatMessage
                          key={`${index}-${message.content.slice(0, 20)}`}
                          role={message.role}
                          content={message.content}
                          isCrisis={message.isCrisis}
                          index={index}
                        />
                      ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isLoading && <TypingIndicator />}
                    </AnimatePresence>

                    {/* Scroll anchor */}
                    <div ref={endRef} className="h-1" />
                  </div>

                  {/* Scroll to Bottom Button */}
                  <AnimatePresence>
                    {showScrollButton && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute bottom-4 right-4"
                      >
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full shadow-lg bg-background/95 backdrop-blur border border-border hover:shadow-glow"
                          onClick={() => scrollToBottom(true)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Share what's on your mind... (Enter to send)"
                    className="resize-none min-h-[56px] max-h-[120px] bg-muted/50 border-border/50 focus:border-primary/50 transition-colors"
                    disabled={isLoading}
                  />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isLoading || !input.trim()}
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300 h-[56px] w-[56px]"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </form>

                {/* Crisis Hotline Footer */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2"
                >
                  <span className="text-destructive">🚨</span>
                  In crisis? Call AASRA:{" "}
                  <a
                    href="tel:9152987821"
                    className="text-primary hover:underline font-semibold"
                  >
                    +91-9152987821
                  </a>
                  <span className="text-muted-foreground/50">|</span>
                  <span>Emergency: 112</span>
                </motion.p>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <SummaryModal
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        summary={summary}
        loading={summaryLoading}
      />

      <Footer />
    </div>
  );
};

export default AIChatbot;
