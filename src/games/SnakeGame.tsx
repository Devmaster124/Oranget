
import { useState, useEffect, useRef, useCallback } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Users, User } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"

type Position = { x: number; y: number }
type Direction = { x: number; y: number }

const GRID_SIZE = 20
const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400

export default function SnakeGame() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const { user } = useAuth()
  
  const [score, setScore] = useState(0)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameMode, setGameMode] = useState<'single' | 'multi' | null>(null)
  const [friends, setFriends] = useState<any[]>([])
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  
  // Snake game state
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>({ x: 1, y: 0 })

  // Load friends list
  useEffect(() => {
    const loadFriends = async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .limit(10)
      
      if (profiles) {
        setFriends(profiles.filter(p => p.id !== user?.id))
      }
    }
    
    if (user) {
      loadFriends()
    }
  }, [user])

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE))
    }
  }, [])

  const gameLoop = useCallback(() => {
    setSnake(prevSnake => {
      const newSnake = [...prevSnake]
      const head = { ...newSnake[0] }
      
      head.x += direction.x
      head.y += direction.y
      
      // Check wall collision
      if (head.x < 0 || head.x >= CANVAS_WIDTH / GRID_SIZE || 
          head.y < 0 || head.y >= CANVAS_HEIGHT / GRID_SIZE) {
        setGameOver(true)
        setGameRunning(false)
        return prevSnake
      }
      
      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        setGameRunning(false)
        return prevSnake
      }
      
      newSnake.unshift(head)
      
      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10)
        setFood(generateFood())
      } else {
        newSnake.pop()
      }
      
      return newSnake
    })
  }, [direction, food, generateFood])

  useEffect(() => {
    if (gameRunning && !gameOver) {
      gameLoopRef.current = window.setInterval(gameLoop, 150)
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameRunning, gameOver, gameLoop])

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#f97316'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw snake
    ctx.fillStyle = '#16a34a'
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#15803d' : '#16a34a'
      ctx.fillRect(
        segment.x * GRID_SIZE, 
        segment.y * GRID_SIZE, 
        GRID_SIZE - 1, 
        GRID_SIZE - 1
      )
    })
    
    // Draw food
    ctx.fillStyle = '#dc2626'
    ctx.fillRect(
      food.x * GRID_SIZE, 
      food.y * GRID_SIZE, 
      GRID_SIZE - 1, 
      GRID_SIZE - 1
    )
    
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = '32px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2)
    }
  }, [snake, food, gameOver])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 })
          break
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 })
          break
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 })
          break
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 })
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, gameRunning])

  const startSinglePlayer = () => {
    setGameMode('single')
    setGameRunning(true)
    setGameOver(false)
    setScore(0)
    setSnake([{ x: 10, y: 10 }])
    setFood(generateFood())
    setDirection({ x: 1, y: 0 })
  }

  const startMultiplayer = () => {
    setGameMode('multi')
    setShowInviteDialog(true)
  }

  const inviteFriend = async (friendId: string) => {
    // TODO: Implement multiplayer session creation
    console.log('Inviting friend:', friendId)
    setShowInviteDialog(false)
    // For now, start single player
    startSinglePlayer()
  }

  const pauseGame = () => {
    setGameRunning(!gameRunning)
  }

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
                <p className="text-orange-500">Use arrow keys to control your snake!</p>
              </CardHeader>
              <CardContent className="text-center">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_WIDTH}
                  height={CANVAS_HEIGHT}
                  className="border-4 border-orange-300 rounded-2xl mx-auto mb-6 bg-orange-100"
                />
                
                <div className="flex justify-center space-x-4">
                  {!gameRunning && !gameOver && !gameMode && (
                    <>
                      <Button
                        onClick={startSinglePlayer}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black rounded-2xl px-8"
                      >
                        <User className="w-5 h-5 mr-2" />
                        Single Player
                      </Button>
                      
                      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={startMultiplayer}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black rounded-2xl px-8"
                          >
                            <Users className="w-5 h-5 mr-2" />
                            Multiplayer
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl border-4 border-orange-200">
                          <DialogHeader>
                            <DialogTitle className="text-2xl text-orange-600 font-black">Invite a Friend</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            {friends.map((friend) => (
                              <Button
                                key={friend.id}
                                onClick={() => inviteFriend(friend.id)}
                                variant="outline"
                                className="w-full justify-start border-2 border-orange-200 hover:bg-orange-50"
                              >
                                {friend.username}
                              </Button>
                            ))}
                            {friends.length === 0 && (
                              <p className="text-orange-500 text-center py-4">No friends found. Add some friends first!</p>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
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
                  
                  {gameOver && (
                    <Button
                      onClick={() => {
                        setGameOver(false)
                        setGameMode(null)
                      }}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-2xl px-8"
                    >
                      Play Again
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
