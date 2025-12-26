import { motion, useReducedMotion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, Lightbulb, Phone, AlertTriangle } from "lucide-react";
import { 
  AnimatedSection,
  AnimatedCard,
  GradientText,
  StaggerContainer,
  StaggerItem,
  FloatingElement,
  AnimatedBackground
} from "@/components/motion";

const About = () => {
  const shouldReduceMotion = useReducedMotion();

  const features = [
    {
      icon: Users,
      title: "For Students, By Understanding",
      description: "We speak your language—literally. SAHAY understands Hinglish, campus slang, and the cultural context that shapes your experiences.",
      gradient: "from-blue-500/10 to-cyan-500/5"
    },
    {
      icon: Shield,
      title: "Safe & Judgment-Free",
      description: "Your conversations are private. Share your thoughts, feelings, and concerns in a space free from judgment or stigma.",
      gradient: "from-green-500/10 to-emerald-500/5"
    },
    {
      icon: Lightbulb,
      title: "Practical Wellness Strategies",
      description: "From pranayama to grounding techniques, get actionable strategies rooted in both modern psychology and traditional wellness practices.",
      gradient: "from-amber-500/10 to-orange-500/5"
    },
    {
      icon: Heart,
      title: "AI-Powered Support",
      description: "Our AI companion provides 24/7 support with empathetic responses, personalized pathways, and wellness insights tailored to your needs.",
      gradient: "from-pink-500/10 to-rose-500/5"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground variant="mesh" />
      <Header />
      
      <main className="flex-1 relative">
        <section className="container py-16">
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <FloatingElement duration={4} distance={8}>
                <motion.div
                  animate={!shouldReduceMotion ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="h-16 w-16 text-primary fill-primary/20 mx-auto mb-6" />
                </motion.div>
              </FloatingElement>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                About <GradientText shimmer>Sahay</GradientText>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-muted-foreground"
              >
                <span className="text-primary font-medium">सहय</span> means "support" in Hindi—and that's exactly what we're here to provide.
              </motion.p>
            </motion.div>

            {/* Intro Text */}
            <AnimatedSection delay={0.1}>
              <motion.div 
                className="prose prose-lg max-w-none mb-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-lg text-foreground leading-relaxed">
                  Sahay is a culturally-aware mental wellness platform specifically designed for Indian university students. 
                  We understand the unique challenges you face—exam stress, career pressure, family expectations, and the 
                  journey of finding yourself in a rapidly changing world.
                </p>
              </motion.div>
            </AnimatedSection>

            {/* Features Grid */}
            <StaggerContainer 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
              staggerDelay={0.1}
            >
              {features.map((feature, index) => (
                <StaggerItem key={feature.title}>
                  <AnimatedCard index={index} hoverEffect>
                    <Card className={`border-primary/20 h-full bg-gradient-to-br ${feature.gradient} hover:border-primary/40 transition-colors`}>
                      <CardContent className="p-6">
                        <motion.div
                          whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                        >
                          <feature.icon className="h-10 w-10 text-primary mb-4" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Mission Card */}
            <AnimatedSection delay={0.2}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-primary/5 border-primary/20 mb-12 overflow-hidden relative">
                  {/* Animated border */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-30"
                    style={{
                      background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)",
                      backgroundSize: "200% 100%",
                    }}
                    animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <CardContent className="p-8 relative">
                    <motion.h2 
                      className="text-2xl font-bold mb-4 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      Our Mission
                    </motion.h2>
                    <motion.p 
                      className="text-lg text-foreground text-center leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      To make mental wellness support accessible, culturally relevant, and stigma-free for every 
                      Indian university student. We believe that seeking support is a sign of strength, not weakness.
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>

            {/* Disclaimer Card */}
            <AnimatedSection delay={0.3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="bg-destructive/5 border-destructive/20 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4 justify-center">
                      <motion.div
                        animate={!shouldReduceMotion ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-destructive">Important Disclaimer</h2>
                    </div>
                    
                    <div className="space-y-4 text-foreground">
                      <p>
                        <strong>SAHAY is NOT a substitute for professional mental health care.</strong> We provide wellness 
                        support, coping strategies, and a listening ear—but we cannot diagnose conditions or provide 
                        clinical treatment.
                      </p>
                      <p>
                        <strong>If you are experiencing a mental health crisis, self-harm thoughts, or suicidal ideation:</strong>
                      </p>
                      
                      <StaggerContainer className="space-y-3 ml-4" staggerDelay={0.1}>
                        <StaggerItem>
                          <motion.div 
                            className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10"
                            whileHover={{ x: 5 }}
                          >
                            <Phone className="h-5 w-5 text-destructive flex-shrink-0" />
                            <span>
                              Call AASRA immediately:{" "}
                              <a href="tel:9152987821" className="text-primary hover:underline font-semibold">
                                +91-9152987821
                              </a>
                            </span>
                          </motion.div>
                        </StaggerItem>
                        <StaggerItem>
                          <motion.div className="flex items-center gap-3" whileHover={{ x: 5 }}>
                            <span className="w-5 h-5 flex items-center justify-center">•</span>
                            <span>Contact your local emergency services (dial 112)</span>
                          </motion.div>
                        </StaggerItem>
                        <StaggerItem>
                          <motion.div className="flex items-center gap-3" whileHover={{ x: 5 }}>
                            <span className="w-5 h-5 flex items-center justify-center">•</span>
                            <span>Reach out to a trusted friend, family member, or counselor</span>
                          </motion.div>
                        </StaggerItem>
                        <StaggerItem>
                          <motion.div className="flex items-center gap-3" whileHover={{ x: 5 }}>
                            <span className="w-5 h-5 flex items-center justify-center">•</span>
                            <span>Visit your nearest hospital emergency department</span>
                          </motion.div>
                        </StaggerItem>
                      </StaggerContainer>
                      
                      <motion.p 
                        className="text-sm italic mt-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        Our AI companion is trained to recognize crisis situations and will always encourage you to 
                        seek immediate professional help when needed.
                      </motion.p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
