import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface SummaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: {
    reflection: string;
    actionItems: string[];
  } | null;
  loading: boolean;
}

export function SummaryModal({ open, onOpenChange, summary, loading }: SummaryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Conversation Summary
          </DialogTitle>
          <DialogDescription>
            A reflection on your conversation and actionable next steps
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : summary ? (
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">💭</span>
                  Reflection
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {summary.reflection}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  Action Items
                </h3>
                <ul className="space-y-3">
                  {summary.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No summary available
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
