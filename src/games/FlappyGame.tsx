
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useNavigate } from 'react-router-dom'

export default function FlappyGame() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const bird = useRef({ x: 50, y: 250, velocity: 0, size: 20 })
  const pipes = useRef<Array<{ x: number, height: number, passed: boolean }>>([])
  const gameLoop = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 500

    const gravity = 0.6
    const jump = -12
    const pipeWidth = 60
    const pipeGap = 150

    const updateGame = () => {
      if (!gameStarted || gameOver) return

      // Update bird
      bird.current.velocity += gravity
      bird.current.y += bird.current.velocity

      // Check ground/ceiling collision
      if (bird.current.y <= 0 || bird.current.y >= canvas.height - bird.current.size) {
        setGameOver(true)
        return
      }

      // Update pipes
      pipes.current = pipes.current.filter(pipe => pipe.x > -pipeWidth)
      
      if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < canvas.width - 300) {
        pipes.current.push({
          x: canvas.width,
          height: Math.random() * (canvas.height - pipeGap - 100) + 50,
          passed: false
        })
      }

      pipes.current.forEach(pipe => {
        pipe.x -= 3

        // Check collision
        if (
          bird.current.x < pipe.x + pipeWidth &&
          bird.current.x + bird.current.size > pipe.x &&
          (bird.current.y < pipe.height || bird.current.y + bird.current.size > pipe.height + pipeGap)
        ) {
          setGameOver(true)
          return
        }

        // Score
        if (!pipe.passed && pipe.x + pipeWidth < bird.current.x) {
          pipe.passed = true
          setScore(prev => prev + 1)
        }
      })

      // Draw
      ctx.fillStyle = '#87CEEB'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw bird
      ctx.fillStyle = '#FFD700'
      ctx.fillRect(bird.current.x, bird.current.y, bird.current.size, bird.current.size)

      // Draw pipes
      ctx.fillStyle = '#228B22'
      pipes.current.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height)
        ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvas.height - pipe.height - pipeGap)
      })

      gameLoop.current = requestAnimationFrame(updateGame)
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameStarted && !gameOver) {
        e.preventDefault()
        bird.current.velocity = jump
      }
    }

    const handleClick = () => {
      if (gameStarted && !gameOver) {
        bird.current.velocity = jump
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    canvas.addEventListener('click', handleClick)

    if (gameStarted && !gameOver) {
      updateGame()
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      canvas.removeEventListener('click', handleClick)
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current)
      }
    }
  }, [gameStarted, gameOver])

  const startGame = () => {
    bird.current = { x: 50, y: 250, velocity: 0, size: 20 }
    pipes.current = []
    setScore(0)
    setGameStarted(true)
    setGameOver(false)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setScore(0)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 font-fredoka">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-blue-100 rounded-xl" />
                <div>
                  <h1 className="text-3xl md:text-4xl font-fredoka text-blue-600 font-black drop-shadow-lg">
                    🐦 Flappy Titan
                  </h1>
                  <p className="text-blue-500 mt-1 font-bold">Navigate through the pipes!</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/games')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl"
              >
                Back to Games
              </Button>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-4 border-blue-200 rounded-3xl shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-b-4 border-blue-300">
                <CardTitle className="text-2xl font-black text-center">
                  Score: {score} | {gameOver ? 'Game Over!' : gameStarted ? 'Flying!' : 'Ready to Fly?'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <canvas
                  ref={canvasRef}
                  className="border-4 border-blue-300 rounded-2xl mx-auto bg-sky-200"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                
                <div className="mt-6 space-y-4">
                  {!gameStarted && !gameOver && (
                    <>
                      <Button
                        onClick={startGame}
                        className="bg-green-500 hover:bg-green-600 text-white font-black text-xl px-8 py-4 rounded-2xl"
                      >
                        Start Flying! 🚀
                      </Button>
                      <p className="text-blue-600 font-bold">
                        Press SPACE or click to flap your wings!
                      </p>
                    </>
                  )}
                  
                  {gameOver && (
                    <>
                      <div className="text-2xl font-black text-red-600 mb-4">
                        Game Over! Final Score: {score}
                      </div>
                      <div className="space-x-4">
                        <Button
                          onClick={startGame}
                          className="bg-green-500 hover:bg-green-600 text-white font-black px-6 py-3 rounded-xl"
                        >
                          Try Again
                        </Button>
                        <Button
                          onClick={resetGame}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-black px-6 py-3 rounded-xl"
                        >
                          Menu
                        </Button>
                      </div>
                    </>
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
