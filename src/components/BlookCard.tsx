
import { Card } from "@/components/ui/card"

export type BlookRarity = 'uncommon' | 'rare' | 'epic' | 'legendary' | 'chroma' | 'mythical' | 'master' | 'dev'

interface BlookCardProps {
  name: string
  rarity: BlookRarity
  owned?: number
  className?: string
}

const rarityColors = {
  uncommon: 'border-uncommon bg-gradient-to-br from-green-50 to-green-100',
  rare: 'border-rare bg-gradient-to-br from-blue-50 to-blue-100',
  epic: 'border-epic bg-gradient-to-br from-purple-50 to-purple-100',
  legendary: 'border-legendary bg-gradient-to-br from-yellow-50 to-yellow-100',
  chroma: 'border-chroma bg-gradient-to-br from-teal-50 to-teal-100',
  mythical: 'border-mythical bg-gradient-to-br from-pink-50 to-pink-100',
  master: 'border-master bg-gradient-to-br from-emerald-50 to-emerald-100',
  dev: 'border-dev bg-gradient-to-br from-amber-50 to-amber-100',
}

const rarityTextColors = {
  uncommon: 'text-uncommon',
  rare: 'text-rare',
  epic: 'text-epic',
  legendary: 'text-legendary',
  chroma: 'text-chroma',
  mythical: 'rainbow-text',
  master: 'matrix-text',
  dev: 'animate-dev-cycle',
}

export function BlookCard({ name, rarity, owned = 0, className = "" }: BlookCardProps) {
  return (
    <Card className={`relative p-4 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${rarityColors[rarity]} ${className}`}>
      <div className="aspect-square bg-white rounded-lg mb-3 flex items-center justify-center border border-gray-200">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-fredoka text-xl">{name.charAt(0)}</span>
        </div>
      </div>
      
      <h3 className="font-fredoka text-sm text-center text-gray-800 mb-1">{name}</h3>
      
      <div className="text-center">
        <span className={`text-xs font-medium uppercase tracking-wider ${rarityTextColors[rarity]}`}>
          {rarity}
        </span>
      </div>
      
      {owned > 0 && (
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {owned}
        </div>
      )}
    </Card>
  )
}
