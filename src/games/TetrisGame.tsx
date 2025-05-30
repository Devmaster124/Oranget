
import { useState, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause } from 'lucide-react'

export default function TetrisGame() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameRunning, setGameRunning] = useState(false)

  const startGame = () => {
    setGameRunning(true)
    setScore(0)
    setLines(0)
    setLevel(1)
  }

  const pauseGame = () => {
    setGameRunning(!gameRunning)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-purple-100 to-blue-50 font-fredoka">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-purple-100 rounded-xl" />
                <Button
                  onClick={() => navigate('/games')}
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-600 hover:bg-purple-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-4 border-purple-200 rounded-3xl shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-purple-600 font-black">🟦 Tetris Duel</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={600}
                    className="border-4 border-purple-300 rounded-2xl mx-auto mb-6 bg-gray-900"
                  />
                  
                  <div className="flex justify-center space-x-4">
                    {!gameRunning && (
                      <Button
                        onClick={startGame}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white font-black rounded-2xl px-8"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Game
                      </Button>
                    )}
                    
                    {gameRunning && (
                      <Button
                        onClick={pauseGame}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-black rounded-2xl px-8"
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-4 border-purple-200 rounded-3xl shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-600 font-black text-center">Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-purple-100 rounded-2xl p-4 text-center">
                      <div className="text-purple-600 font-bold">Score</div>
                      <div className="text-2xl font-black text-purple-800">{score.toLocaleString()}</div>
                    </div>
                    <div className="bg-purple-100 rounded-2xl p-4 text-center">
                      <div className="text-purple-600 font-bold">Lines</div>
                      <div className="text-2xl font-black text-purple-800">{lines}</div>
                    </div>
                    <div className="bg-purple-100 rounded-2xl p-4 text-center">
                      <div className="text-purple-600 font-bold">Level</div>
                      <div className="text-2xl font-black text-purple-800">{level}</div>
                    </div>
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
