
interface TokenDisplayProps {
  amount: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TokenDisplay({ amount, size = 'md', className = "" }: TokenDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`inline-flex items-center space-x-1 font-fredoka ${sizeClasses[size]} ${className}`}>
      <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-orange-300 shadow-sm">
        <span className="text-white text-xs font-fredoka font-bold">T</span>
      </div>
      <span className="font-bold text-orange-700">{amount.toLocaleString()}</span>
    </div>
  )
}
