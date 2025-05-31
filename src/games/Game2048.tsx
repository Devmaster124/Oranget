
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useNavigate } from 'react-router-dom'

type Board = number[][]

export default function Game2048() {
  const navigate = useNavigate()
  const [board, setBoard] = useState<Board>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  const initializeBoard = () => {
    const newBoard: Board = Array(4).fill(null).map(() => Array(4).fill(0))
    addRandomTile(newBoard)
    addRandomTile(newBoard)
    return newBoard
  }

  const addRandomTile = (board: Board) => {
    const emptyCells: Array<[number, number]> = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push([i, j])
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      board[row][col] = Math.random() < 0.9 ? 2 : 4
    }
  }

  const moveLeft = (board: Board) => {
    let newScore = 0
    const newBoard = board.map(row => {
      const filtered = row.filter(cell => cell !== 0)
      const merged: number[] = []
      
      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2)
          newScore += filtered[i] * 2
          if (filtered[i] * 2 === 2048) setWon(true)
          i++
        } else {
          merged.push(filtered[i])
        }
      }
      
      while (merged.length < 4) {
        merged.push(0)
      }
      
      return merged
    })
    
    return { board: newBoard, score: newScore }
  }

  const rotateBoard = (board: Board) => {
    return board[0].map((_, colIndex) => 
      board.map(row => row[colIndex]).reverse()
    )
  }

  const move = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return

    let workingBoard = [...board.map(row => [...row])]
    let rotations = 0

    switch (direction) {
      case 'right':
        rotations = 2
        break
      case 'up':
        rotations = 3
        break
      case 'down':
        rotations = 1
        break
    }

    for (let i = 0; i < rotations; i++) {
      workingBoard = rotateBoard(workingBoard)
    }

    const { board: movedBoard, score: moveScore } = moveLeft(workingBoard)

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      workingBoard = rotateBoard(movedBoard)
    }

    const boardChanged = JSON.stringify(board) !== JSON.stringify(workingBoard)
    
    if (boardChanged) {
      addRandomTile(workingBoard)
      setBoard(workingBoard)
      setScore(prev => prev + moveScore)
      
      if (!canMove(workingBoard)) {
        setGameOver(true)
      }
    }
  }

  const canMove = (board: Board) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return true
        if (j < 3 && board[i][j] === board[i][j + 1]) return true
        if (i < 3 && board[i][j] === board[i + 1][j]) return true
      }
    }
    return false
  }

  const startNewGame = () => {
    setBoard(initializeBoard())
    setScore(0)
    setGameOver(false)
    setWon(false)
  }

  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      0: 'bg-gray-200',
      2: 'bg-yellow-200',
      4: 'bg-yellow-300',
      8: 'bg-orange-300',
      16: 'bg-orange-400',
      32: 'bg-red-400',
      64: 'bg-red-500',
      128: 'bg-yellow-500',
      256: 'bg-yellow-600',
      512: 'bg-orange-600',
      1024: 'bg-orange-700',
      2048: 'bg-red-700'
    }
    return colors[value] || 'bg-purple-600'
  }

  useEffect(() => {
    if (board.length === 0) {
      setBoard(initializeBoard())
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          move('left')
          break
        case 'ArrowRight':
          e.preventDefault()
          move('right')
          break
        case 'ArrowUp':
          e.preventDefault()
          move('up')
          break
        case 'ArrowDown':
          e.preventDefault()
          move('down')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [board, gameOver])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50 font-fredoka">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-purple-100 rounded-xl" />
                <div>
                  <h1 className="text-3xl md:text-4xl font-fredoka text-purple-600 font-black drop-shadow-lg">
                    🎯 2048 Titan
                  </h1>
                  <p className="text-purple-500 mt-1 font-bold">Combine tiles to reach 2048!</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/games')}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl"
              >
                Back to Games
              </Button>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-4 border-purple-200 rounded-3xl shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-b-4 border-purple-300">
                <CardTitle className="text-2xl font-black text-center">
                  Score: {score} | {won ? 'You Won! 🎉' : gameOver ? 'Game Over!' : 'Keep Going!'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <div className="grid grid-cols-4 gap-2 md:gap-4 w-80 h-80 mx-auto mb-6 p-4 bg-gray-300 rounded-2xl">
                  {board.flat().map((value, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-center text-lg md:text-2xl font-black rounded-xl ${getTileColor(value)} ${
                        value > 0 ? 'text-white shadow-lg' : 'text-gray-400'
                      }`}
                    >
                      {value > 0 ? value : ''}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                    <Button
                      onClick={() => move('up')}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl"
                    >
                      ↑
                    </Button>
                    <Button
                      onClick={startNewGame}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl"
                    >
                      New Game
                    </Button>
                    <Button
                      onClick={() => move('left')}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl"
                    >
                      ←
                    </Button>
                    <Button
                      onClick={() => move('right')}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl"
                    >
                      →
                    </Button>
                    <div></div>
                    <Button
                      onClick={() => move('down')}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl"
                    >
                      ↓
                    </Button>
                  </div>
                  
                  <p className="text-purple-600 font-bold text-sm">
                    Use arrow keys or buttons to move tiles!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
