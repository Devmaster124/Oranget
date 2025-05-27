
import { Card } from "@/components/ui/card"

export type BlookRarity = 'uncommon' | 'rare' | 'epic' | 'legendary' | 'chroma' | 'mythical' | 'master' | 'dev'

interface BlookCardProps {
  name: string
  rarity: BlookRarity
  owned?: number
  className?: string
}

const rarityColors = {
  uncommon: 'border-green-400 bg-gradient-to-br from-green-100 to-green-200 shadow-green-200/50',
  rare: 'border-blue-400 bg-gradient-to-br from-blue-100 to-blue-200 shadow-blue-200/50',
  epic: 'border-purple-400 bg-gradient-to-br from-purple-100 to-purple-200 shadow-purple-200/50',
  legendary: 'border-yellow-400 bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-yellow-200/50',
  chroma: 'border-teal-400 bg-gradient-to-br from-teal-100 to-teal-200 shadow-teal-200/50',
  mythical: 'border-pink-400 bg-gradient-to-br from-pink-100 to-pink-200 shadow-pink-200/50',
  master: 'border-emerald-400 bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-emerald-200/50',
  dev: 'border-amber-400 bg-gradient-to-br from-amber-100 to-amber-200 shadow-amber-200/50',
}

const rarityTextColors = {
  uncommon: 'text-green-600',
  rare: 'text-blue-600',
  epic: 'text-purple-600',
  legendary: 'text-yellow-600',
  chroma: 'text-teal-600',
  mythical: 'rainbow-text',
  master: 'matrix-text',
  dev: 'animate-dev-cycle',
}

const rarityGlowColors = {
  uncommon: 'shadow-green-300/30',
  rare: 'shadow-blue-300/30',
  epic: 'shadow-purple-300/30',
  legendary: 'shadow-yellow-300/30',
  chroma: 'shadow-teal-300/30',
  mythical: 'shadow-pink-300/30',
  master: 'shadow-emerald-300/30',
  dev: 'shadow-amber-300/30',
}

export function BlookCard({ name, rarity, owned = 0, className = "" }: BlookCardProps) {
  return (
    <Card className={`relative p-4 border-3 transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-3xl ${rarityColors[rarity]} ${rarityGlowColors[rarity]} ${className}`}>
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/20 to-orange-600/20 blur-sm"></div>
      
      {/* Inner blook container */}
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-orange-300 to-orange-600 rounded-full mb-3 flex items-center justify-center border-4 border-white shadow-lg relative overflow-hidden">
          {/* Dark space background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black opacity-30"></div>
          
          {/* Blook character - simplified orange blob */}
          <div className="relative w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-orange-300 shadow-inner">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-fredoka text-lg drop-shadow-sm">{name.charAt(0)}</span>
            </div>
          </div>
          
          {/* Subtle stars/dots for space effect */}
          <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-3 right-1 w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
          <div className="absolute bottom-2 left-1 w-0.5 h-0.5 bg-white rounded-full opacity-50"></div>
        </div>
        
        <h3 className="font-fredoka text-sm text-center text-gray-800 mb-1">{name}</h3>
        
        <div className="text-center">
          <span className={`text-xs font-fredoka font-bold uppercase tracking-wider ${rarityTextColors[rarity]}`}>
            {rarity}
          </span>
        </div>
        
        {owned > 0 && (
          <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-fredoka font-bold rounded-full w-7 h-7 flex items-center justify-center border-2 border-white shadow-lg">
            {owned}
          </div>
        )}
      </div>
    </Card>
  )
}
