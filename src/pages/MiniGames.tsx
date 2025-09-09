
import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

const games = [
  {
    id: 'snake',
    title: 'Snake Game',
    description: 'Classic snake game with an orange twist!',
    route: '/games/snake',
    emoji: '🐍'
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'Stack and clear lines in this classic puzzle game!',
    route: '/games/tetris',
    emoji: '🧩'
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Match pairs of cards in this memory challenge!',
    route: '/games/memory',
    emoji: '🧠'
  },
  {
    id: 'flappy',
    title: 'Flappy Bird',
    description: 'Navigate through pipes in this challenging game!',
    route: '/games/flappy',
    emoji: '🐦'
  },
  {
    id: '2048',
    title: '2048',
    description: 'Combine tiles to reach 2048!',
    route: '/games/2048',
    emoji: '🔢'
  }
]

export default function MiniGames() {
  const navigate = useNavigate()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        {/* Orange Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
          <div 
            className="w-full h-full opacity-30"
            style={{
              backgroundImage: 'url("https://i.ibb.co/S4BD0J48/download.png")',
              animation: 'animatedBackground 9s linear infinite'
            }}
          />
        </div>

        <AppSidebar />
        
        <main className="flex-1 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-orange-600/80 backdrop-blur-sm border-b-4 border-orange-300">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-orange-700 rounded-xl text-white" />
              <div>
                <h1 className="text-4xl text-white font-bold drop-shadow-lg font-fredoka">Mini Games</h1>
                <p className="text-orange-100 mt-1 font-medium font-fredoka">Play fun games and earn tokens!</p>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <Card 
                    key={game.id}
                    className="group bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 hover:scale-105 transition-all duration-300 cursor-pointer rounded-3xl overflow-hidden"
                    onClick={() => navigate(game.route)}
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
                      <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
                        {game.emoji}
                      </span>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-2xl text-white font-bold font-fredoka">{game.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-orange-100 mb-4 font-medium font-fredoka">{game.description}</p>
                      <Button 
                        className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold border-2 border-orange-200 font-fredoka"
                      >
                        Play Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
