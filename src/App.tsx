
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Community from "./pages/Community";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Blooks from "./pages/Blooks";
import Marketplace from "./pages/Marketplace";
import ExchangeCart from "./pages/ExchangeCart";
import Trading from "./pages/Trading";
import MiniGames from "./pages/MiniGames";
import Settings from "./pages/Settings";
import News from "./pages/News";
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
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
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
            <Route path="/trading" element={
              <ProtectedRoute>
                <Trading />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/minigames" element={
              <ProtectedRoute>
                <MiniGames />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/news" element={
              <ProtectedRoute>
                <News />
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
