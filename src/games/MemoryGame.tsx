
import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, RotateCcw } from 'lucide-react'

export default function MemoryGame() {
  const navigate = useNavigate()
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  
  const emojis = ['🍊', '🐱', '🎮', '⭐', '🎯', '🎨', '🎪', '🎭']
  const [cards, setCards] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])

  const startGame = () => {
    const shuffledCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
    setFlipped([])
    setMatched([])
    setScore(0)
    setMoves(0)
    setGameStarted(true)
  }

  const resetGame = () => {
    setGameStarted(false)
    setCards([])
    setFlipped([])
    setMatched([])
    setScore(0)
    setMoves(0)
  }

  const flipCard = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return
    
    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)
    
    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped])
        setScore(score + 100)
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-pink-50 via-pink-100 to-purple-50 font-fredoka">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-pink-100 rounded-xl" />
                <Button
                  onClick={() => navigate('/games')}
                  variant="outline"
                  className="border-2 border-pink-300 text-pink-600 hover:bg-pink-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Games
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-lg font-black text-pink-600">Score: {score}</div>
                <div className="text-lg font-black text-pink-600">Moves: {moves}</div>
              </div>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-4 border-pink-200 rounded-3xl shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-pink-600 font-black">🧠 Memory Match</CardTitle>
              </CardHeader>
              <CardContent>
                {!gameStarted ? (
                  <div className="text-center py-12">
                    <Button
                      onClick={startGame}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white font-black rounded-2xl px-8 py-4 text-xl"
                    >
                      <Play className="w-6 h-6 mr-2" />
                      Start Memory Game
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-6">
                      {cards.map((emoji, index) => (
                        <div
                          key={index}
                          onClick={() => flipCard(index)}
                          className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center text-2xl cursor-pointer
                            transform transition-all duration-300 hover:scale-105 border-4
                            ${flipped.includes(index) || matched.includes(index)
                              ? 'bg-white border-pink-300 shadow-lg'
                              : 'bg-pink-200 border-pink-400 hover:bg-pink-300'
                            }
                          `}
                        >
                          {flipped.includes(index) || matched.includes(index) ? emoji : '?'}
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <Button
                        onClick={resetGame}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black rounded-2xl px-6"
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Reset Game
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
