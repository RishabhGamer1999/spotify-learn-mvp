import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { BottomPlayer } from "@/components/player/BottomPlayer";
import { useAuth } from "@/hooks/useAuth";
import Welcome from "./pages/Welcome";
import OnboardingGoals from "./pages/OnboardingGoals";
import Index from "./pages/Index";
import Goals from "./pages/Goals";
import Learning from "./pages/Learning";
import Achievements from "./pages/Achievements";
import Courses from "./pages/Courses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, onboardingCompleted } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!onboardingCompleted) {
    return <Navigate to="/onboarding/goals" replace />;
  }

  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, onboardingCompleted } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (onboardingCompleted) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading, onboardingCompleted } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public route - Welcome/Landing */}
        <Route 
          path="/" 
          element={
            user && onboardingCompleted ? <Navigate to="/home" replace /> : 
            user && !onboardingCompleted ? <Navigate to="/onboarding/goals" replace /> : 
            <Welcome />
          } 
        />
        
        {/* Onboarding route */}
        <Route path="/onboarding/goals" element={<OnboardingRoute><OnboardingGoals /></OnboardingRoute>} />
        
        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {user && onboardingCompleted && <BottomPlayer />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PlayerProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
