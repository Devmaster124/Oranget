
import { Coins } from 'lucide-react'

interface TokenDisplayProps {
  tokens: number
  orangeDrips?: number
  className?: string
}

export function TokenDisplay({ tokens, orangeDrips = 0, className = "" }: TokenDisplayProps) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-4 border-yellow-300 shadow-lg flex items-center space-x-2">
        <Coins className="w-6 h-6 text-yellow-600" />
        <span className="text-2xl font-black text-yellow-700">{tokens.toLocaleString()}</span>
        <span className="text-yellow-600 font-bold">tokens</span>
      </div>
      
      {orangeDrips > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-4 border-orange-300 shadow-lg flex items-center space-x-2">
          <span className="text-2xl">🧡</span>
          <span className="text-2xl font-black text-orange-700">{orangeDrips.toLocaleString()}</span>
          <span className="text-orange-600 font-bold">drips</span>
        </div>
      )}
    </div>
  )
}
