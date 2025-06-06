
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Star, Sparkles } from 'lucide-react'

interface BlookCardProps {
  blook: {
    id: string
    name: string
    image: string
    rarity: string
  }
  onSelect?: (blook: any) => void
  isSelected?: boolean
  showSelectButton?: boolean
}

export default function BlookCard({ blook, onSelect, isSelected, showSelectButton }: BlookCardProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'from-gray-400 to-gray-600'
      case 'uncommon':
        return 'from-green-400 to-green-600'
      case 'rare':
        return 'from-blue-400 to-blue-600'
      case 'epic':
        return 'from-purple-400 to-purple-600'
      case 'legendary':
        return 'from-yellow-400 to-yellow-600'
      case 'chroma':
        return 'from-pink-400 via-purple-400 to-blue-400'
      default:
        return 'from-orange-400 to-orange-600'
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return null
      case 'uncommon':
        return <Star className="w-4 h-4" />
      case 'rare':
        return <Sparkles className="w-4 h-4" />
      case 'epic':
        return <Crown className="w-4 h-4" />
      case 'legendary':
        return <Crown className="w-4 h-4 text-yellow-300" />
      case 'chroma':
        return <Crown className="w-4 h-4 text-pink-300" />
      default:
        return null
    }
  }

  return (
    <Card
      className={`blacket-card overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
        isSelected ? 'ring-4 ring-yellow-400 scale-105' : ''
      }`}
      onClick={() => onSelect && onSelect(blook)}
    >
      <CardContent className="p-0">
        <div className={`w-full h-24 bg-gradient-to-br ${getRarityColor(blook.rarity)} flex items-center justify-center relative`}>
          <div className="text-3xl">{blook.image}</div>
          {isSelected && (
            <div className="absolute top-1 right-1">
              <Crown className="w-4 h-4 text-yellow-400" />
            </div>
          )}
          <div className="absolute top-1 left-1 flex items-center space-x-1">
            {getRarityIcon(blook.rarity)}
          </div>
          <div className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 rounded titan-one-light">
            {blook.rarity}
          </div>
        </div>
        <div className="p-2 text-center bg-orange-500/20 backdrop-blur-sm">
          <h3 className="text-white font-bold text-xs titan-one-light truncate">
            {blook.name}
          </h3>
          {showSelectButton && (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onSelect && onSelect(blook)
              }}
              className="mt-2 text-xs blacket-button py-1 px-2"
            >
              Select
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
