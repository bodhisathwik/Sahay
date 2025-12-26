import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Compass, Lightbulb, Target, Loader2, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { runGeminiChat } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import {
  AnimatedSection,
  AnimatedCard,
  GradientText,
  StaggerContainer,
  StaggerItem,
  AnimatedBackground
} from "@/components/motion";

interface RoadmapStep {
  path: string;
  reframe: string;
  actions: string[];
}

const ClarityEngine = () => {
  const [prompt, setPrompt] = useState("");
  const [roadmap, setRoadmap] = useState<RoadmapStep[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const generateRoadmap = async () => {
    if (!prompt.trim() || prompt.length > 3000) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a career question (max 3000 characters).",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Use local Gemini utility
      const data = await runGeminiChat({
        type: "clarity",
        payload: {
          careerPrompt: prompt,
          experienceLevel: "student"
        }
      });

      if (!data.success) throw new Error(data.error);

      if (data?.success && data?.data?.roadmap) {
        setRoadmap(data.data.roadmap);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Clarity error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to generate roadmap. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pathColors = [
    "from-blue-500/10 to-cyan-500/5",
    "from-purple-500/10 to-pink-500/5",
    "from-green-500/10 to-emerald-500/5",
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground variant="orbs" />
      <Header />

      <main className="flex-1 container py-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <motion.div
                animate={!shouldReduceMotion ? {
                  rotate: [0, 360],
                } : {}}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Compass className="h-8 w-8 text-primary" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <GradientText>Clarity Engine</GradientText>
              </h1>
            </div>
            <p className="text-muted-foreground">
              Get multi-perspective career guidance tailored to your situation
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!roadmap ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <AnimatedCard delay={0.1}>
                  <Card className="shadow-elegant bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Tell Us About Your Career Question
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Share your current situation, goals, or concerns. Be as specific as you'd like.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Example: I'm a CS student in 3rd year, torn between pursuing higher studies abroad or taking a job offer. My parents expect me to do MBA, but I'm interested in AI research..."
                            className="min-h-[200px] bg-muted/50 border-border/50 focus:border-primary/50 transition-colors"
                            maxLength={3000}
                          />
                        </motion.div>

                        <div className="flex justify-between items-center">
                          <motion.span
                            className="text-xs text-muted-foreground"
                            animate={{
                              color: prompt.length > 2800 ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))"
                            }}
                          >
                            {prompt.length}/3000 characters
                          </motion.span>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={generateRoadmap}
                              disabled={isLoading || !prompt.trim()}
                              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 gap-2"
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4" />
                                  Generate Roadmap
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </motion.div>
            ) : (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Header with Reset */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-center"
                >
                  <h2 className="text-2xl font-bold">Your Career Roadmap</h2>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" onClick={() => setRoadmap(null)} className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Start Over
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Roadmap Cards */}
                <StaggerContainer staggerDelay={0.15}>
                  {roadmap.map((step, index) => (
                    <StaggerItem key={index}>
                      <AnimatedCard index={index} hoverEffect>
                        <Card className={`shadow-elegant overflow-hidden bg-gradient-to-br ${pathColors[index % pathColors.length]} border-border/50`}>
                          <CardHeader>
                            <div className="flex items-start gap-3">
                              <motion.div
                                className="p-2 rounded-full bg-primary/10 mt-1"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                {index === 0 ? (
                                  <Target className="h-5 w-5 text-primary" />
                                ) : (
                                  <Lightbulb className="h-5 w-5 text-primary" />
                                )}
                              </motion.div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <Badge variant="outline" className="bg-background/50">
                                    Path {index + 1}
                                  </Badge>
                                  <CardTitle className="text-xl">{step.path}</CardTitle>
                                </div>

                                {/* Reframe Box */}
                                <motion.div
                                  className="p-4 bg-accent/50 rounded-lg mb-4 border border-accent/20"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                  <p className="text-sm font-semibold text-accent-foreground mb-1 flex items-center gap-2">
                                    <motion.span
                                      animate={{ rotate: [0, 15, -15, 0] }}
                                      transition={{ duration: 0.5, delay: 0.5 }}
                                    >
                                      🔄
                                    </motion.span>
                                    Reframe:
                                  </p>
                                  <p className="text-sm text-accent-foreground">{step.reframe}</p>
                                </motion.div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm font-semibold mb-3">Actionable Steps:</p>
                            <ol className="space-y-3">
                              {step.actions.map((action, actionIndex) => (
                                <motion.li
                                  key={actionIndex}
                                  className="flex items-start gap-3 group"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.4 + actionIndex * 0.1 }}
                                  whileHover={{ x: 5 }}
                                >
                                  <motion.span
                                    className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center mt-0.5"
                                    whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
                                  >
                                    {actionIndex + 1}
                                  </motion.span>
                                  <span className="flex-1 group-hover:text-primary transition-colors">
                                    {action}
                                  </span>
                                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.li>
                              ))}
                            </ol>
                          </CardContent>
                        </Card>
                      </AnimatedCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* CTA Card */}
                <AnimatedSection delay={0.5}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <motion.div
                            animate={!shouldReduceMotion ? {
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          </motion.div>
                          <div>
                            <p className="font-semibold mb-2">Next Steps</p>
                            <p className="text-sm text-muted-foreground">
                              Want to discuss this further? Start a conversation with SAHAY to explore these paths
                              in more detail and get personalized support for your decision.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatedSection>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ClarityEngine;
