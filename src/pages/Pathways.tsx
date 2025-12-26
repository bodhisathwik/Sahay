import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle2, Circle, Save, Loader2, Sparkles, Target } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { runGeminiChat } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  AnimatedSection,
  AnimatedCard,
  GradientText,
  StaggerContainer,
  StaggerItem,
  AnimatedBackground,
  ProgressRing
} from "@/components/motion";

interface PathwayDay {
  day: number;
  title: string;
  actions: string[];
  completed?: boolean;
}

const Pathways = () => {
  const [goal, setGoal] = useState("");
  const [pathway, setPathway] = useState<PathwayDay[] | null>(null);
  const [pathwayId, setPathwayId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const completedDays = pathway?.filter(d => d.completed).length || 0;
  const totalDays = pathway?.length || 5;
  const progressPercent = (completedDays / totalDays) * 100;

  useEffect(() => {
    if (user) {
      loadSavedPathways();
    }
  }, [user]);

  const loadSavedPathways = async () => {
    try {
      if (!user) return;

      const q = query(
        collection(db, "pathways"),
        where("user_id", "==", user.uid),
        orderBy("created_at", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        if (data && Array.isArray(data.days_data)) {
          setPathwayId(docSnap.id);
          setGoal(data.goal);
          setPathway(data.days_data as PathwayDay[]);
        }
      }
    } catch (error) {
      console.error("Error loading pathways:", error);
    }
  };

  const savePathway = async (pathwayData: PathwayDay[], goalText: string) => {
    if (!user) return;

    setIsSaving(true);
    try {
      if (pathwayId) {
        const pathwayRef = doc(db, "pathways", pathwayId);
        await updateDoc(pathwayRef, {
          days_data: pathwayData,
          goal: goalText,
          updated_at: serverTimestamp()
        });
      } else {
        const docRef = await addDoc(collection(db, "pathways"), {
          user_id: user.uid,
          goal: goalText,
          days_data: pathwayData,
          created_at: serverTimestamp()
        });
        setPathwayId(docRef.id);
      }

      toast({
        title: "Progress saved",
        description: "Your pathway progress has been saved.",
      });
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save progress.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const preDefinedGoals = [
    { title: "Manage Exam Anxiety", description: "5-day plan to reduce stress and perform better", emoji: "📚", gradient: "from-blue-500/10 to-cyan-500/5" },
    { title: "Build Better Sleep", description: "Establish healthy sleep patterns", emoji: "😴", gradient: "from-indigo-500/10 to-purple-500/5" },
    { title: "Daily Mindfulness", description: "Start a sustainable meditation practice", emoji: "🧘", gradient: "from-green-500/10 to-emerald-500/5" },
    { title: "Social Connection", description: "Strengthen relationships and reduce isolation", emoji: "💬", gradient: "from-pink-500/10 to-rose-500/5" },
  ];

  const generatePathway = async (selectedGoal?: string) => {
    const goalText = selectedGoal || goal;
    if (!goalText.trim()) {
      toast({
        variant: "destructive",
        title: "Goal Required",
        description: "Please enter a goal or select a predefined one.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await runGeminiChat({
        type: "pathway",
        payload: {
          goal: goalText,
          days: 5,
          intensity: "medium"
        }
      });

      if (response.success && response.data?.pathway) {
        const newPathway = response.data.pathway.map((day: any, index: number) => ({
          ...day,
          day: index + 1,
          completed: false
        }));

        setPathway(newPathway);
        setGoal(goalText);

        await savePathway(newPathway, goalText);
      } else {
        throw new Error(response.error || "Invalid response format");
      }
    } catch (error: any) {
      console.error("Pathway error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to generate pathway. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDayComplete = async (dayIndex: number) => {
    if (!pathway) return;
    const updated = [...pathway];
    updated[dayIndex] = { ...updated[dayIndex], completed: !updated[dayIndex].completed };
    setPathway(updated);
    await savePathway(updated, goal);
  };

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
                animate={!shouldReduceMotion ? { rotate: 360 } : {}}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <TrendingUp className="h-8 w-8 text-primary" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <GradientText>5-Day Pathways</GradientText>
              </h1>
            </div>
            <p className="text-muted-foreground">
              AI-generated wellness plans with daily actionable steps
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!pathway ? (
              <motion.div
                key="create"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Create Pathway Card */}
                <AnimatedCard className="mb-6" delay={0}>
                  <Card className="shadow-elegant border-border/50 bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        Create Your Pathway
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Your Goal</label>
                          <Textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="What would you like to work on? (e.g., 'Manage my exam stress')"
                            className="min-h-[100px] bg-muted/50 border-border/50 focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                          <Button
                            onClick={() => generatePathway()}
                            disabled={isLoading || !goal.trim()}
                            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 gap-2"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4" />
                                Generate My Pathway
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>

                {/* Predefined Goals */}
                <StaggerContainer
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  staggerDelay={0.1}
                >
                  {preDefinedGoals.map((item, index) => (
                    <StaggerItem key={item.title}>
                      <AnimatedCard
                        index={index}
                        onClick={() => generatePathway(item.title)}
                        hoverEffect
                      >
                        <Card className={`cursor-pointer border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden bg-gradient-to-br ${item.gradient}`}>
                          <CardContent className="p-6">
                            <motion.span
                              className="text-3xl mb-3 block"
                              whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                              {item.emoji}
                            </motion.span>
                            <h3 className="font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </CardContent>
                        </Card>
                      </AnimatedCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </motion.div>
            ) : (
              <motion.div
                key="pathway"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Progress Header */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <ProgressRing progress={progressPercent} size={80} strokeWidth={6}>
                      <span className="text-lg font-bold">{completedDays}/{totalDays}</span>
                    </ProgressRing>
                    <div>
                      <h2 className="text-2xl font-bold">Your 5-Day Pathway</h2>
                      <p className="text-muted-foreground text-sm">{goal}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => savePathway(pathway, goal)}
                        disabled={isSaving}
                        className="gap-2"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isSaving ? "Saving..." : "Save Progress"}
                      </Button>
                    </motion.div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setPathway(null); setPathwayId(null); }}
                    >
                      Start Over
                    </Button>
                  </div>
                </motion.div>

                {/* Days List */}
                <StaggerContainer staggerDelay={0.1}>
                  {pathway.map((day, index) => (
                    <StaggerItem key={day.day}>
                      <AnimatedCard index={index} hoverEffect={false}>
                        <Card className={`shadow-elegant border-border/50 transition-all duration-300 ${day.completed ? 'bg-primary/5 border-primary/20' : 'bg-card/80'}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  initial={false}
                                  animate={day.completed ? { scale: [1, 1.2, 1] } : {}}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Badge
                                    variant={day.completed ? "default" : "outline"}
                                    className={`text-sm ${day.completed ? 'bg-primary' : ''}`}
                                  >
                                    Day {day.day}
                                  </Badge>
                                </motion.div>
                                <CardTitle className={`text-xl ${day.completed ? 'text-primary' : ''}`}>
                                  {day.title}
                                </CardTitle>
                              </div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleDayComplete(index)}
                                  className="gap-2"
                                >
                                  <motion.div
                                    initial={false}
                                    animate={day.completed ? { rotate: 360, scale: 1 } : { rotate: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                  >
                                    {day.completed ? (
                                      <CheckCircle2 className="h-5 w-5 text-primary" />
                                    ) : (
                                      <Circle className="h-5 w-5" />
                                    )}
                                  </motion.div>
                                  {day.completed ? "Completed" : "Mark Complete"}
                                </Button>
                              </motion.div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {day.actions.map((action, actionIndex) => (
                                <motion.li
                                  key={actionIndex}
                                  className="flex items-start gap-2"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * actionIndex }}
                                >
                                  <motion.span
                                    className="text-primary mt-1"
                                    animate={day.completed ? { scale: 0.8 } : { scale: 1 }}
                                  >
                                    •
                                  </motion.span>
                                  <span className={day.completed ? "line-through text-muted-foreground" : ""}>
                                    {action}
                                  </span>
                                </motion.li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </AnimatedCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pathways;
