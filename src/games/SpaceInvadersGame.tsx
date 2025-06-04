
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function SpaceInvadersGame() {
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
    let playerX = canvas.width / 2

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw player ship
      ctx.fillStyle = '#0F0'
      ctx.fillRect(playerX - 20, canvas.height - 50, 40, 30)

      // Draw invaders
      ctx.fillStyle = '#F00'
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 10; col++) {
          const x = col * 60 + 50
          const y = row * 50 + 50
          ctx.fillRect(x, y, 30, 30)
        }
      }

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
        
        <main className="flex-1 relative z-10">
          {/* Header with Oranget branding */}
          <div className="flex items-center justify-between p-6 border-b-4 border-orange-300">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-orange-600 rounded-xl text-white bg-orange-500/50" />
              <h1 className="text-6xl text-white font-titan drop-shadow-lg" style={{ fontWeight: '400' }}>
                Oranget
              </h1>
            </div>
            <Button
              onClick={() => navigate('/minigames')}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-orange-600 font-titan"
              style={{ fontWeight: '400' }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </div>

          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-5xl text-white font-titan mb-4 drop-shadow-lg" style={{ fontWeight: '400' }}>
                  Space Invaders 👽
                </h2>
              </div>

              <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="text-3xl text-white font-titan mb-6 drop-shadow-lg" style={{ fontWeight: '400' }}>
                      Score: {score}
                    </div>
                    {!gameStarted ? (
                      <Button
                        onClick={() => setGameStarted(true)}
                        className="bg-orange-400 hover:bg-orange-500 text-white font-titan px-12 py-6 text-2xl rounded-2xl border-2 border-orange-200 shadow-lg"
                        style={{ fontWeight: '400' }}
                      >
                        Start Game
                      </Button>
                    ) : (
                      <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        className="border-4 border-orange-200 rounded-lg bg-black shadow-xl"
                      />
                    )}
                  </div>
                  <div className="text-center text-orange-100 font-titan text-lg" style={{ fontWeight: '400' }}>
                    <p>Use arrow keys to move and spacebar to shoot!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
