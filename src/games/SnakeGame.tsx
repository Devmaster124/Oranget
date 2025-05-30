
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause } from 'lucide-react'

export default function SnakeGame() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const startGame = () => {
    setGameRunning(true)
    setGameOver(false)
    setScore(0)
  }

  const pauseGame = () => {
    setGameRunning(!gameRunning)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple snake game placeholder - you can implement full logic later
    ctx.fillStyle = '#f97316'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = '#ffffff'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Snake Game Coming Soon!', canvas.width / 2, canvas.height / 2)
  }, [gameRunning])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 font-fredoka">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-100 rounded-xl" />
                <Button
                  onClick={() => navigate('/games')}
                  variant="outline"
                  className="border-2 border-orange-300 text-orange-600 hover:bg-orange-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
              </div>
              <div className="text-2xl font-black text-orange-600">
                Score: {score}
              </div>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-orange-600 font-black">🐍 Snake Battle</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="border-4 border-orange-300 rounded-2xl mx-auto mb-6 bg-orange-100"
                />
                
                <div className="flex justify-center space-x-4">
                  {!gameRunning && !gameOver && (
                    <Button
                      onClick={startGame}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black rounded-2xl px-8"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Game
                    </Button>
                  )}
                  
                  {gameRunning && (
                    <Button
                      onClick={pauseGame}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-black rounded-2xl px-8"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
