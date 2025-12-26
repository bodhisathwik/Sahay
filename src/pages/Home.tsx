import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MessageCircle, Calendar, Compass, TrendingUp, Heart, Shield, Sparkles, ArrowRight } from "lucide-react";
import { 
  AnimatedSection, 
  AnimatedCard, 
  GradientText,
  StaggerContainer, 
  StaggerItem,
  FloatingElement,
  AnimatedBackground 
} from "@/components/motion";

const Home = () => {
  const shouldReduceMotion = useReducedMotion();

  const features = [
    {
      icon: MessageCircle,
      title: "AI Companion",
      description: "Chat with SAHAY - your empathetic, culturally-aware wellness companion who understands Hinglish and student life.",
      link: "/aichatbot",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Wellness Watch",
      description: "Analyze your calendar to find burnout patterns and get personalized wellness nudges.",
      link: "/wellnesswatch",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      icon: Compass,
      title: "Clarity Engine",
      description: "Get career guidance with multi-perspective roadmaps tailored to your situation.",
      link: "/clarityengine",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: "5-Day Pathways",
      description: "Follow AI-generated wellness plans with daily actionable steps toward your goals.",
      link: "/pathways",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground variant="orbs" />
      <Header />
      
      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="container py-20 md:py-32 relative">
          <div className="mx-auto max-w-4xl text-center">
            {/* Floating Heart */}
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20,
                delay: 0.2 
              }}
              className="mb-8 flex items-center justify-center"
            >
              <FloatingElement duration={4} distance={8}>
                <motion.div
                  animate={!shouldReduceMotion ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <Heart className="h-16 w-16 text-primary fill-primary/20" />
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30 blur-xl -z-10"
                    animate={!shouldReduceMotion ? {
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.5, 0.3],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </FloatingElement>
            </motion.div>

            {/* Hero Title with Word Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Welcome to{" "}
                <GradientText shimmer animate>
                  Sahay
                </GradientText>
              </h1>
            </motion.div>

            {/* Hindi Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground mb-4"
            >
              <span className="text-primary font-medium">सहय</span> - Your Wellness Companion
            </motion.p>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              A culturally-aware mental wellness platform designed for Indian university students.
              Get empathetic support, practical strategies, and personalized guidance—all in a safe, judgment-free space.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/aichatbot">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 gap-2 group"
                  >
                    <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Start a Conversation
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/about">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 border-border/50 hover:bg-muted/50 transition-all"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <AnimatedSection className="container py-16 relative" delay={0.1}>
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Your Wellness <GradientText>Toolkit</GradientText>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Four powerful features designed to support your mental wellness journey
            </motion.p>
          </div>

          <StaggerContainer 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            staggerDelay={0.1}
          >
            {features.map((feature, index) => (
              <StaggerItem key={feature.title}>
                <Link to={feature.link}>
                  <AnimatedCard 
                    index={index}
                    className="h-full"
                    hoverEffect
                  >
                    <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-colors duration-300 overflow-hidden group">
                      <CardContent className="p-6 relative">
                        {/* Background gradient on hover */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                        />
                        
                        <motion.div 
                          className={`mb-4 inline-flex p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} bg-opacity-10`}
                          whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                        >
                          <feature.icon className="h-8 w-8 text-primary" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                        
                        {/* Arrow indicator */}
                        <motion.div
                          className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                        >
                          <ArrowRight className="h-5 w-5 text-primary" />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </AnimatedSection>

        {/* Trust & Safety Section */}
        <AnimatedSection className="container py-16" delay={0.2}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20 backdrop-blur-sm overflow-hidden relative">
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-lg opacity-30"
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)",
                  backgroundSize: "200% 100%",
                }}
                animate={{
                  backgroundPosition: ["200% 0%", "-200% 0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              <CardContent className="p-8 text-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                >
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4">Your Safety Matters</h3>
                <p className="text-muted-foreground mb-4">
                  SAHAY is designed to provide support and wellness strategies. However, we are not a substitute for professional mental health care.
                </p>
                <motion.p 
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <strong className="text-destructive">Crisis Support:</strong> If you're experiencing a mental health crisis, please contact AASRA at{" "}
                  <a href="tel:9152987821" className="text-primary hover:underline font-semibold transition-colors">
                    +91-9152987821
                  </a>{" "}
                  or visit your nearest emergency services immediately.
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
