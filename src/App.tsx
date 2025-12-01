import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { BottomPlayer } from "@/components/player/BottomPlayer";
import Index from "./pages/Index";
import Goals from "./pages/Goals";
import Learning from "./pages/Learning";
import Achievements from "./pages/Achievements";
import Courses from "./pages/Courses";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PlayerProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <BottomPlayer />
      </PlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
