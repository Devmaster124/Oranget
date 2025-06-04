
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function FroggerGame() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (!gameStarted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let frogY = canvas.height - 50

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#228B22'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw road
      ctx.fillStyle = '#333'
      ctx.fillRect(0, canvas.height / 2 - 100, canvas.width, 200)

      // Draw frog
      ctx.fillStyle = '#0F0'
      ctx.fillRect(canvas.width / 2 - 15, frogY, 30, 30)

      // Draw cars
      ctx.fillStyle = '#F00'
      ctx.fillRect(100, canvas.height / 2 - 50, 60, 30)
      ctx.fillRect(300, canvas.height / 2, 60, 30)
      ctx.fillRect(500, canvas.height / 2 - 25, 60, 30)

      animationId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [gameStarted])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
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
        
        <main className="flex-1 relative z-10 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-600 rounded-xl text-white bg-orange-500/50" />
                <Button
                  onClick={() => navigate('/minigames')}
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-orange-600 font-fredoka"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
              </div>
              <h1 className="text-4xl text-white font-bold drop-shadow-lg font-fredoka">Frogger 🐸</h1>
            </div>

            <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-2xl text-white font-bold mb-4 font-fredoka">Score: {score}</div>
                  {!gameStarted ? (
                    <Button
                      onClick={() => setGameStarted(true)}
                      className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-8 py-4 text-xl rounded-2xl font-fredoka"
                    >
                      Start Game
                    </Button>
                  ) : (
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={600}
                      className="border-4 border-orange-200 rounded-lg"
                    />
                  )}
                </div>
                <div className="text-center text-orange-100 font-fredoka">
                  <p>Help the frog cross the road safely! Use arrow keys to move.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
