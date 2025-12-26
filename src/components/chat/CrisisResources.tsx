import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, ExternalLink, Heart, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CrisisResourcesProps {
  show: boolean;
  onDismiss?: () => void;
}

const resources = [
  {
    name: "AASRA",
    phone: "+91-9152987821",
    description: "24/7 Suicide Prevention Helpline",
    type: "primary" as const,
  },
  {
    name: "iCall",
    phone: "+91-9152987821",
    description: "Psychosocial Counseling",
    type: "secondary" as const,
  },
  {
    name: "Vandrevala Foundation",
    phone: "1860-2662-345",
    description: "24/7 Mental Health Support",
    type: "secondary" as const,
  },
  {
    name: "Emergency Services",
    phone: "112",
    description: "National Emergency Number",
    type: "emergency" as const,
  },
];

export const CrisisResources = ({ show, onDismiss }: CrisisResourcesProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-4"
        >
          <Card className="border-destructive/50 bg-destructive/5 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start gap-3 mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="p-2 rounded-full bg-destructive/10"
                >
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    You're Not Alone - Help is Available
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    If you're in crisis or having thoughts of self-harm, please reach out to one of these resources:
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {resources.map((resource, index) => (
                  <motion.a
                    key={resource.name}
                    href={`tel:${resource.phone.replace(/[^0-9+]/g, '')}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                      resource.type === "primary"
                        ? "bg-destructive/10 border border-destructive/30"
                        : resource.type === "emergency"
                        ? "bg-accent border border-border"
                        : "bg-muted/50 border border-border/50"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      resource.type === "primary" || resource.type === "emergency"
                        ? "bg-destructive/20"
                        : "bg-primary/10"
                    }`}>
                      <Phone className={`h-4 w-4 ${
                        resource.type === "primary" || resource.type === "emergency"
                          ? "text-destructive"
                          : "text-primary"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{resource.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {resource.description}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${
                      resource.type === "primary" ? "text-destructive" : "text-primary"
                    }`}>
                      {resource.phone}
                    </span>
                  </motion.a>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>Your safety is our priority</span>
                </div>
                {onDismiss && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDismiss}
                    className="text-xs h-auto py-1"
                  >
                    I'm okay, continue chatting
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
