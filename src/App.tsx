import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MiniGames from "./pages/MiniGames";
import SnakeGame from "./games/SnakeGame";
import TetrisGame from "./games/TetrisGame";
import MemoryGame from "./games/MemoryGame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/games" element={
              <ProtectedRoute>
                <MiniGames />
              </ProtectedRoute>
            } />
            <Route path="/games/snake" element={
              <ProtectedRoute>
                <SnakeGame />
              </ProtectedRoute>
            } />
            <Route path="/games/tetris" element={
              <ProtectedRoute>
                <TetrisGame />
              </ProtectedRoute>
            } />
            <Route path="/games/memory" element={
              <ProtectedRoute>
                <MemoryGame />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;