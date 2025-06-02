
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
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/snake',
    emoji: '🐍'
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'Stack and clear lines in this classic puzzle game!',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/tetris',
    emoji: '🧩'
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Match pairs of cards in this memory challenge!',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/memory',
    emoji: '🧠'
  },
  {
    id: 'flappy',
    title: 'Flappy Bird',
    description: 'Navigate through pipes in this challenging game!',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/flappy',
    emoji: '🐦'
  },
  {
    id: '2048',
    title: '2048',
    description: 'Combine tiles to reach 2048!',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/2048',
    emoji: '🔢'
  },
  {
    id: 'minecraft',
    title: '3D Minecraft',
    description: 'Build and explore in a 3D minecraft-style world!',
    image: 'https://images.pexels.com/photos/21067/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/minecraft',
    emoji: '⛏️'
  },
  {
    id: 'halo',
    title: '3D Halo Arena',
    description: 'Epic 3D combat arena with futuristic weapons!',
    image: 'https://images.pexels.com/photos/5428100/pexels-photo-5428100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/halo',
    emoji: '🚀'
  },
  {
    id: 'splitgate',
    title: '3D Splitgate Portal',
    description: 'Portal-based 3D shooter with teleportation mechanics!',
    image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/splitgate',
    emoji: '🌀'
  },
  {
    id: 'fortnite',
    title: '3D Battle Royale',
    description: 'Fortnite-style battle royale with building mechanics!',
    image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/fortnite',
    emoji: '🏗️'
  }
]

export default function MiniGames() {
  const navigate = useNavigate()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900">
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
          <div className="flex items-center justify-between p-6 bg-orange-800/80 backdrop-blur-sm border-b-4 border-orange-400">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-orange-700 rounded-xl text-white" />
              <div>
                <h1 className="text-4xl text-white font-black drop-shadow-lg">Mini Games</h1>
                <p className="text-orange-200 mt-1 font-bold">Play fun games and earn tokens!</p>
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
                    className="group bg-orange-800/80 backdrop-blur-sm border-4 border-orange-400 hover:scale-105 transition-all duration-300 cursor-pointer rounded-3xl overflow-hidden"
                    onClick={() => navigate(game.route)}
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center">
                      <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
                        {game.emoji}
                      </span>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-2xl text-white font-black">{game.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-orange-200 mb-4 font-bold">{game.description}</p>
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black border-2 border-orange-300"
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
