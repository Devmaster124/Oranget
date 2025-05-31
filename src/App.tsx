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
import Profile from "./pages/Profile";
import Blooks from "./pages/Blooks";
import Marketplace from "./pages/Marketplace";
import ExchangeCart from "./pages/ExchangeCart";
import SnakeGame from "./games/SnakeGame";
import TetrisGame from "./games/TetrisGame";
import MemoryGame from "./games/MemoryGame";
import FlappyGame from "./games/FlappyGame";
import Game2048 from "./games/Game2048";

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
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/blooks" element={
              <ProtectedRoute>
                <Blooks />
              </ProtectedRoute>
            } />
            <Route path="/marketplace" element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            } />
            <Route path="/exchange" element={
              <ProtectedRoute>
                <ExchangeCart />
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
            <Route path="/games/flappy" element={
              <ProtectedRoute>
                <FlappyGame />
              </ProtectedRoute>
            } />
            <Route path="/games/2048" element={
              <ProtectedRoute>
                <Game2048 />
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
