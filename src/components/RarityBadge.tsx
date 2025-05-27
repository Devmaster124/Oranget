
interface RarityBadgeProps {
  rarity: string
  className?: string
}

export function RarityBadge({ rarity, className = "" }: RarityBadgeProps) {
  const getRarityStyle = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'uncommon':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'epic':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'chroma':
        return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'mythical':
        return 'bg-pink-100 text-pink-800 border-pink-200 rainbow-text'
      case 'master':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 matrix-text'
      case 'dev':
        return 'bg-amber-100 text-amber-800 border-amber-200 animate-dev-cycle'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRarityStyle(rarity)} ${className}`}>
      {rarity.toUpperCase()}
    </span>
  )
}
