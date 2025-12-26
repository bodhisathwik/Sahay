import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import AIChatbot from "./pages/AIChatbot";
import WellnessWatch from "./pages/WellnessWatch";
import ClarityEngine from "./pages/ClarityEngine";
import Pathways from "./pages/Pathways";
import About from "./pages/About";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-2xl font-bold text-destructive">Configuration Required</h1>
          <p className="text-muted-foreground">
            The application has been migrated to Firebase but is missing the required configuration.
          </p>
          <div className="bg-muted p-4 rounded-lg text-left text-sm font-mono overflow-auto">
            <p className="mb-2 font-semibold">Please update .env with:</p>
            VITE_FIREBASE_API_KEY=...<br />
            VITE_FIREBASE_PROJECT_ID=...<br />
            (and other keys)
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/aichatbot" element={<ProtectedRoute><AIChatbot /></ProtectedRoute>} />
      <Route path="/wellnesswatch" element={<ProtectedRoute><WellnessWatch /></ProtectedRoute>} />
      <Route path="/clarityengine" element={<ProtectedRoute><ClarityEngine /></ProtectedRoute>} />
      <Route path="/pathways" element={<ProtectedRoute><Pathways /></ProtectedRoute>} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
