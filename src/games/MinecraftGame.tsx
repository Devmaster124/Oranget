
import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function MinecraftGame() {
  const navigate = useNavigate()
  const mountRef = useRef<HTMLDivElement>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [playerCount, setPlayerCount] = useState(1)
  const [score, setScore] = useState(0)

  useEffect(() => {
    // Simple canvas-based minecraft game
    if (!mountRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.backgroundColor = '#87CEEB'
    mountRef.current.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simple block-based world
    const blockSize = 40
    const world = []
    
    // Generate simple world
    for (let x = 0; x < 20; x++) {
      world[x] = []
      for (let y = 0; y < 15; y++) {
        if (y > 10) {
          world[x][y] = 'grass'
        } else if (y > 8) {
          world[x][y] = 'dirt'
        } else {
          world[x][y] = 'stone'
        }
      }
    }

    let playerX = 5
    let playerY = 9

    const drawWorld = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw blocks
      for (let x = 0; x < world.length; x++) {
        for (let y = 0; y < world[x].length; y++) {
          const block = world[x][y]
          if (block) {
            let color = '#8B4513'
            if (block === 'grass') color = '#7CFC00'
            if (block === 'dirt') color = '#8B4513'
            if (block === 'stone') color = '#808080'
            
            ctx.fillStyle = color
            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize)
            ctx.strokeStyle = '#000'
            ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize)
          }
        }
      }
      
      // Draw player
      ctx.fillStyle = '#0066CC'
      ctx.fillRect(playerX * blockSize + 5, playerY * blockSize + 5, blockSize - 10, blockSize - 10)
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (playerY > 0) playerY--
          break
        case 'ArrowDown':
        case 's':
          if (playerY < 14) playerY++
          break
        case 'ArrowLeft':
        case 'a':
          if (playerX > 0) playerX--
          break
        case 'ArrowRight':
        case 'd':
          if (playerX < 19) playerX++
          break
      }
      setScore(prev => prev + 1)
      drawWorld()
    }

    document.addEventListener('keydown', handleKeyPress)
    drawWorld()

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      if (mountRef.current && canvas) {
        mountRef.current.removeChild(canvas)
      }
    }
  }, [])

  const handleReset = () => {
    setScore(0)
    window.location.reload()
  }

  const toggleOnlineMode = () => {
    setIsOnline(!isOnline)
    setPlayerCount(isOnline ? 1 : Math.floor(Math.random() * 8) + 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-6 font-['Titan_One']">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/games')}
              variant="outline"
              className="border-2 border-green-300 text-green-600 hover:bg-green-50 text-xl font-black rounded-2xl px-6 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Games
            </Button>
            <h1 className="text-5xl text-green-600 font-black">Minecraft World</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={toggleOnlineMode}
              className={`text-xl font-black rounded-2xl px-6 py-3 ${
                isOnline 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              {isOnline ? 'Online' : 'Offline'} ({playerCount})
            </Button>
            <Button
              onClick={handleReset}
              className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-black rounded-2xl px-6 py-3"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-green-100 border-2 border-green-300">
            <CardHeader>
              <CardTitle className="text-green-600 text-xl font-black">Exploration Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-green-700">{Math.floor(score)}</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-100 border-2 border-blue-300">
            <CardHeader>
              <CardTitle className="text-blue-600 text-xl font-black">Players Online</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-blue-700">{playerCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-100 border-2 border-yellow-300">
            <CardHeader>
              <CardTitle className="text-yellow-600 text-xl font-black">Game Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-black text-yellow-700">{isOnline ? 'Multiplayer' : 'Single Player'}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-4 border-green-300 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
            <CardTitle className="text-2xl font-black">
              Use WASD or Arrow Keys to move around the world!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div 
              ref={mountRef} 
              className="w-full h-[600px] bg-gradient-to-b from-blue-200 to-green-200"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
