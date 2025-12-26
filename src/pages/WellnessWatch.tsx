import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, Flame, Brain, Heart, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { runGeminiChat } from "@/lib/gemini";
import {
  AnimatedSection,
  AnimatedCard,
  GradientText,
  StaggerContainer,
  StaggerItem,
  AnimatedBackground
} from "@/components/motion";

interface Nudge {
  type: "burnout" | "overload" | "balance";
  title: string;
  description: string;
  emoji: string;
  actions: string[];
}

const WellnessWatch = () => {
  const [connected, setConnected] = useState(false);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { connectGoogleCalendar } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const connectCalendar = async () => {
    const { error, accessToken } = await connectGoogleCalendar();

    if (error) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (accessToken) {
      setConnected(true);
      sessionStorage.setItem("google_calendar_token", accessToken);
      toast({
        title: "Calendar Connected",
        description: "Google Calendar linked successfully.",
      });
    }
  };

  const fetchCalendarEvents = async (token: string) => {
    try {
      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Next 7 days

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("Calendar fetch error:", error);
      return [];
    }
  };

  const analyzeSchedule = async () => {
    setIsAnalyzing(true);
    const token = sessionStorage.getItem("google_calendar_token");

    if (!token) {
      toast({
        title: "Session Expired",
        description: "Please reconnect your calendar.",
        variant: "destructive",
      });
      setConnected(false);
      setIsAnalyzing(false);
      return;
    }

    try {
      // 1. Fetch real events
      const events = await fetchCalendarEvents(token);

      // 2. Send to Gemini
      const result = await runGeminiChat({
        type: "analyze_schedule",
        payload: { events }
      });

      if (result.success && result.data.nudges) {
        setNudges(result.data.nudges);
        toast({
          title: "Analysis Complete",
          description: `Found ${result.data.nudges.length} wellness insights for you.`,
        });
      } else {
        throw new Error("Failed to generate insights");
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getNudgeIcon = (type: string) => {
    switch (type) {
      case "burnout": return <Flame className="h-5 w-5" />;
      case "overload": return <Brain className="h-5 w-5" />;
      case "balance": return <Heart className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getNudgeColor = (type: string) => {
    switch (type) {
      case "burnout": return "destructive";
      case "overload": return "default";
      case "balance": return "secondary";
      default: return "default";
    }
  };

  const getNudgeBg = (type: string) => {
    switch (type) {
      case "burnout": return "from-red-500/10 to-orange-500/5";
      case "overload": return "from-purple-500/10 to-blue-500/5";
      case "balance": return "from-green-500/10 to-emerald-500/5";
      default: return "from-muted/50 to-muted/30";
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground variant="mesh" />
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
                animate={!shouldReduceMotion ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Calendar className="h-8 w-8 text-primary" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <GradientText>Wellness Watch</GradientText>
              </h1>
            </div>
            <p className="text-muted-foreground">
              Analyze your schedule to prevent burnout and find balance
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!connected ? (
              <motion.div
                key="connect"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-12 text-center relative">
                    {/* Background decoration */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                      >
                        <Calendar className="h-16 w-16 text-primary mx-auto mb-6" />
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold mb-4"
                      >
                        Connect Your Calendar
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-muted-foreground mb-6 max-w-md mx-auto"
                      >
                        Link your Google Calendar to get personalized wellness insights based on your schedule patterns.
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={connectCalendar}
                          className="bg-gradient-primary hover:shadow-glow transition-all duration-300 gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          Connect Google Calendar
                        </Button>
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xs text-muted-foreground mt-4"
                      >
                        Your calendar data is analyzed privately and never shared
                      </motion.p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="connected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Connected Status Card */}
                <AnimatedCard className="mb-6" delay={0}>
                  <Card className="shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <motion.div
                            className="p-3 rounded-full bg-primary/10"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Calendar className="h-6 w-6 text-primary" />
                          </motion.div>
                          <div>
                            <p className="font-semibold">Google Calendar Connected</p>
                            <p className="text-sm text-muted-foreground">Last synced: Just now</p>
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={analyzeSchedule}
                            disabled={isAnalyzing}
                            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 gap-2"
                          >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Brain className="h-4 w-4" />
                                Analyze Calendar
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>

                {/* Nudges List */}
                <AnimatePresence mode="wait">
                  {nudges.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold mb-4"
                      >
                        Your Wellness Nudges
                      </motion.h2>

                      <StaggerContainer staggerDelay={0.15}>
                        {nudges.map((nudge, index) => (
                          <StaggerItem key={index}>
                            <AnimatedCard index={index} hoverEffect>
                              <Card className={`shadow-elegant border-border/50 overflow-hidden bg-gradient-to-r ${getNudgeBg(nudge.type)}`}>
                                <CardHeader>
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                      <motion.span
                                        className="text-3xl"
                                        animate={!shouldReduceMotion ? {
                                          scale: [1, 1.2, 1],
                                          rotate: [0, 10, -10, 0]
                                        } : {}}
                                        transition={{
                                          duration: 0.5,
                                          delay: index * 0.2,
                                          repeat: Infinity,
                                          repeatDelay: 5
                                        }}
                                      >
                                        {nudge.emoji}
                                      </motion.span>
                                      <div>
                                        <CardTitle className="text-xl">{nudge.title}</CardTitle>
                                        <Badge variant={getNudgeColor(nudge.type) as any} className="mt-2">
                                          {getNudgeIcon(nudge.type)}
                                          <span className="ml-1 capitalize">{nudge.type}</span>
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-muted-foreground mb-4">{nudge.description}</p>
                                  <div className="space-y-2">
                                    <p className="text-sm font-semibold">Quick Actions:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {nudge.actions.map((action, actionIndex) => (
                                        <motion.div
                                          key={actionIndex}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: 0.3 + actionIndex * 0.1 }}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-sm hover:bg-primary/10 hover:border-primary/30 transition-colors"
                                          >
                                            {action}
                                          </Button>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </AnimatedCard>
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </motion.div>
                  )}

                  {nudges.length === 0 && !isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="shadow-elegant bg-card/80 backdrop-blur-sm">
                        <CardContent className="p-12 text-center">
                          <motion.div
                            animate={!shouldReduceMotion ? { y: [0, -10, 0] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          </motion.div>
                          <p className="text-lg text-muted-foreground">
                            Click "Analyze Calendar" to get personalized wellness insights
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WellnessWatch;
