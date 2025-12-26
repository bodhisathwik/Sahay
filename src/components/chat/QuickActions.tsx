import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Heart, 
  Coffee, 
  BookOpen, 
  Users, 
  Frown,
  Sparkles 
} from "lucide-react";

interface QuickActionsProps {
  onSelect: (message: string) => void;
  disabled?: boolean;
}

const quickActions = [
  {
    icon: Frown,
    label: "I'm stressed",
    message: "I'm feeling really stressed out lately and could use some help",
    color: "text-orange-500",
  },
  {
    icon: Heart,
    label: "Anxiety",
    message: "I've been experiencing anxiety and it's affecting my daily life",
    color: "text-red-400",
  },
  {
    icon: BookOpen,
    label: "Exam pressure",
    message: "I'm overwhelmed with exam pressure and don't know how to cope",
    color: "text-blue-500",
  },
  {
    icon: Coffee,
    label: "Burnout",
    message: "I think I'm experiencing burnout. I feel exhausted all the time",
    color: "text-amber-500",
  },
  {
    icon: Users,
    label: "Feeling lonely",
    message: "I've been feeling lonely and disconnected from others",
    color: "text-purple-500",
  },
  {
    icon: Brain,
    label: "Need clarity",
    message: "I'm confused about my career/life direction and need some clarity",
    color: "text-primary",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export const QuickActions = ({ onSelect, disabled }: QuickActionsProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm text-muted-foreground">Quick topics</span>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-2"
      >
        {quickActions.map((action) => (
          <motion.div key={action.label} variants={item}>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onSelect(action.message)}
              className="gap-2 hover:bg-accent hover:border-primary/30 transition-all duration-200 hover:scale-105"
            >
              <action.icon className={`h-4 w-4 ${action.color}`} />
              {action.label}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
