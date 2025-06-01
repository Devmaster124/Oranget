
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
    route: '/games/snake'
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'Stack and clear lines in this classic puzzle game!',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/tetris'
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Match pairs of cards in this memory challenge!',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/memory'
  },
  {
    id: 'flappy',
    title: 'Flappy Bird',
    description: 'Navigate through pipes in this challenging game!',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/flappy'
  },
  {
    id: '2048',
    title: '2048',
    description: 'Combine tiles to reach 2048!',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/2048'
  },
  {
    id: 'minecraft',
    title: '3D Minecraft',
    description: 'Build and explore in a 3D minecraft-style world!',
    image: 'https://images.pexels.com/photos/21067/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/minecraft'
  },
  {
    id: 'halo',
    title: '3D Halo Arena',
    description: 'Epic 3D combat arena with futuristic weapons!',
    image: 'https://images.pexels.com/photos/5428100/pexels-photo-5428100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/halo'
  },
  {
    id: 'splitgate',
    title: '3D Splitgate Portal',
    description: 'Portal-based 3D shooter with teleportation mechanics!',
    image: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/splitgate'
  },
  {
    id: 'fortnite',
    title: '3D Battle Royale',
    description: 'Fortnite-style battle royale with building mechanics!',
    image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    route: '/games/fortnite'
  }
]

export default function MiniGames() {
  const navigate = useNavigate()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 to-orange-100">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-100 rounded-xl" />
                <div>
                  <h1 className="text-4xl text-orange-600">Mini Games</h1>
                  <p className="text-orange-500 mt-1">Play fun games and earn tokens!</p>
                </div>
              </div>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <Card 
                  key={game.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-orange-200 bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={game.image} 
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-2xl text-orange-600">{game.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-orange-500 mb-4">{game.description}</p>
                    <Button 
                      onClick={() => navigate(game.route)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
