
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

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const BLOCK_SIZE = 30

type Block = {
  x: number
  y: number
  color: string
}

type Piece = {
  blocks: Block[]
  type: string
}

const TETRIS_PIECES = {
  I: { blocks: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 3, y: 0}], color: '#00ffff' },
  O: { blocks: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], color: '#ffff00' },
  T: { blocks: [{x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}], color: '#800080' },
  S: { blocks: [{x: 1, y: 0}, {x: 2, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}], color: '#00ff00' },
  Z: { blocks: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}], color: '#ff0000' },
  J: { blocks: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}], color: '#0000ff' },
  L: { blocks: [{x: 2, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}], color: '#ffa500' }
}

export default function TetrisGame() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const { user } = useAuth()
  
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameRunning, setGameRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameMode, setGameMode] = useState<'single' | 'multi' | null>(null)
  const [friends, setFriends] = useState<any[]>([])
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  
  const [board, setBoard] = useState<(string | null)[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
  )
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null)
  const [piecePosition, setPiecePosition] = useState({ x: 4, y: 0 })

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

  const getRandomPiece = useCallback(() => {
    const pieces = Object.keys(TETRIS_PIECES)
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
    const pieceData = TETRIS_PIECES[randomPiece as keyof typeof TETRIS_PIECES]
    
    return {
      blocks: pieceData.blocks.map(block => ({ ...block, color: pieceData.color })),
      type: randomPiece
    }
  }, [])

  const canPieceMove = useCallback((piece: Piece, newX: number, newY: number, newBoard: (string | null)[][]) => {
    return piece.blocks.every(block => {
      const x = block.x + newX
      const y = block.y + newY
      
      return x >= 0 && x < BOARD_WIDTH && 
             y >= 0 && y < BOARD_HEIGHT && 
             !newBoard[y][x]
    })
  }, [])

  const placePiece = useCallback((piece: Piece, x: number, y: number, board: (string | null)[][]) => {
    const newBoard = board.map(row => [...row])
    
    piece.blocks.forEach(block => {
      const boardX = block.x + x
      const boardY = block.y + y
      if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
        newBoard[boardY][boardX] = block.color
      }
    })
    
    return newBoard
  }, [])

  const clearLines = useCallback((board: (string | null)[][]) => {
    let linesCleared = 0
    const newBoard = board.filter(row => {
      const isFull = row.every(cell => cell !== null)
      if (isFull) linesCleared++
      return !isFull
    })
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null))
    }
    
    return { newBoard, linesCleared }
  }, [])

  const gameLoop = useCallback(() => {
    if (!currentPiece) return

    const newY = piecePosition.y + 1
    
    if (canPieceMove(currentPiece, piecePosition.x, newY, board)) {
      setPiecePosition(prev => ({ ...prev, y: newY }))
    } else {
      // Place piece and check for lines
      const newBoard = placePiece(currentPiece, piecePosition.x, piecePosition.y, board)
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)
      
      setBoard(clearedBoard)
      setLines(prev => prev + linesCleared)
      setScore(prev => prev + linesCleared * 100 * level)
      
      // Check game over
      if (piecePosition.y <= 1) {
        setGameOver(true)
        setGameRunning(false)
        return
      }
      
      // Spawn new piece
      setCurrentPiece(getRandomPiece())
      setPiecePosition({ x: 4, y: 0 })
    }
  }, [currentPiece, piecePosition, board, canPieceMove, placePiece, clearLines, level, getRandomPiece])

  useEffect(() => {
    if (gameRunning && !gameOver) {
      const speed = Math.max(100, 500 - (level - 1) * 50)
      gameLoopRef.current = window.setInterval(gameLoop, speed)
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
  }, [gameRunning, gameOver, gameLoop, level])

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw board
    board.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillStyle = cell
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1)
        }
      })
    })
    
    // Draw current piece
    if (currentPiece) {
      currentPiece.blocks.forEach(block => {
        const x = (block.x + piecePosition.x) * BLOCK_SIZE
        const y = (block.y + piecePosition.y) * BLOCK_SIZE
        
        ctx.fillStyle = block.color
        ctx.fillRect(x, y, BLOCK_SIZE - 1, BLOCK_SIZE - 1)
      })
    }
    
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = '24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2)
    }
  }, [board, currentPiece, piecePosition, gameOver])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning || !currentPiece) return
      
      switch (e.key) {
        case 'ArrowLeft':
          if (canPieceMove(currentPiece, piecePosition.x - 1, piecePosition.y, board)) {
            setPiecePosition(prev => ({ ...prev, x: prev.x - 1 }))
          }
          break
        case 'ArrowRight':
          if (canPieceMove(currentPiece, piecePosition.x + 1, piecePosition.y, board)) {
            setPiecePosition(prev => ({ ...prev, x: prev.x + 1 }))
          }
          break
        case 'ArrowDown':
          if (canPieceMove(currentPiece, piecePosition.x, piecePosition.y + 1, board)) {
            setPiecePosition(prev => ({ ...prev, y: prev.y + 1 }))
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentPiece, piecePosition, board, canPieceMove, gameRunning])

  const startSinglePlayer = () => {
    setGameMode('single')
    setGameRunning(true)
    setGameOver(false)
    setScore(0)
    setLines(0)
    setLevel(1)
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)))
    setCurrentPiece(getRandomPiece())
    setPiecePosition({ x: 4, y: 0 })
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
                  <p className="text-purple-500">Use arrow keys to move and rotate pieces!</p>
                </CardHeader>
                <CardContent className="text-center">
                  <canvas
                    ref={canvasRef}
                    width={BOARD_WIDTH * BLOCK_SIZE}
                    height={BOARD_HEIGHT * BLOCK_SIZE}
                    className="border-4 border-purple-300 rounded-2xl mx-auto mb-6 bg-gray-900"
                  />
                  
                  <div className="flex justify-center space-x-4">
                    {!gameRunning && !gameOver && !gameMode && (
                      <>
                        <Button
                          onClick={startSinglePlayer}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white font-black rounded-2xl px-8"
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
                          <DialogContent className="bg-white rounded-3xl border-4 border-purple-200">
                            <DialogHeader>
                              <DialogTitle className="text-2xl text-purple-600 font-black">Invite a Friend</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              {friends.map((friend) => (
                                <Button
                                  key={friend.id}
                                  onClick={() => inviteFriend(friend.id)}
                                  variant="outline"
                                  className="w-full justify-start border-2 border-purple-200 hover:bg-purple-50"
                                >
                                  {friend.username}
                                </Button>
                              ))}
                              {friends.length === 0 && (
                                <p className="text-purple-500 text-center py-4">No friends found. Add some friends first!</p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                    
                    {gameRunning && (
                      <Button
                        onClick={pauseGame}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-black rounded-2xl px-8"
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        {gameRunning ? 'Pause' : 'Resume'}
                      </Button>
                    )}
                    
                    {gameOver && (
                      <Button
                        onClick={() => {
                          setGameOver(false)
                          setGameMode(null)
                        }}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-black rounded-2xl px-8"
                      >
                        Play Again
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
