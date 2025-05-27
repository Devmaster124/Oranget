
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
    <div className={`inline-flex items-center space-x-1 ${sizeClasses[size]} ${className}`}>
      <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">T</span>
      </div>
      <span className="font-medium text-orange-700">{amount.toLocaleString()}</span>
    </div>
  )
}
