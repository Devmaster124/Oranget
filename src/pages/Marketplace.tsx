
import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { TokenDisplay } from '@/components/TokenDisplay'

interface MarketplacePack {
  id: string
  name: string
  price: number
  color: string
  image: string
}

export default function Marketplace() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [packs, setPacks] = useState<MarketplacePack[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [userTokens, setUserTokens] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedPack, setSelectedPack] = useState<MarketplacePack | null>(null)
  const [isOpening, setIsOpening] = useState(false)

  useEffect(() => {
    if (user) {
      setUserTokens(user.tokens)
      fetchMarketplacePacks()
    }
  }, [user])

  const fetchMarketplacePacks = async () => {
    setLoading(true)
    
    const mockPacks: MarketplacePack[] = [
      { id: '1', name: 'Ice Monster Pack', price: 25, color: 'from-blue-400 to-blue-600', image: '❄️' },
      { id: '2', name: 'Wonderland Pack', price: 25, color: 'from-purple-400 to-purple-600', image: '🎩' },
      { id: '3', name: 'Video Game Pack', price: 25, color: 'from-green-400 to-green-600', image: '🎮' },
      { id: '4', name: 'Elemental Pack', price: 25, color: 'from-red-400 to-red-600', image: '🔥' },
      { id: '5', name: 'Breakfast Pack', price: 25, color: 'from-yellow-400 to-yellow-600', image: '🥞' },
      { id: '6', name: 'Medieval Pack', price: 25, color: 'from-gray-600 to-gray-800', image: '⚔️' },
      { id: '7', name: 'Magic Pack', price: 25, color: 'from-pink-400 to-pink-600', image: '✨' },
      { id: '8', name: 'Safari Pack', price: 25, color: 'from-orange-400 to-orange-600', image: '🦁' }
    ]
    
    setPacks(mockPacks)
    setLoading(false)
  }

  const handlePackClick = async (pack: MarketplacePack) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to open packs",
        variant: "destructive"
      })
      return
    }

    if (userTokens < pack.price) {
      toast({
        title: "Insufficient tokens",
        description: `You need ${pack.price - userTokens} more tokens to open this pack`,
        variant: "destructive"
      })
      return
    }

    setSelectedPack(pack)
    setIsOpening(true)

    // Simulate pack opening animation
    setTimeout(() => {
      const newTokenAmount = userTokens - pack.price
      setUserTokens(newTokenAmount)
      
      const updatedUser = { ...user, tokens: newTokenAmount }
      localStorage.setItem('oranget_user', JSON.stringify(updatedUser))
      
      toast({
        title: "Pack opened successfully!",
        description: `You opened ${pack.name} and got awesome items!`,
      })
      
      setIsOpening(false)
      setSelectedPack(null)
    }, 3000)
  }

  const filteredPacks = packs.filter(pack => 
    pack.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{
        backgroundColor: '#2c2f36',
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(139, 139, 139, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(139, 139, 139, 0.2) 0%, transparent 50%)
        `
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white font-titan text-2xl" style={{ fontWeight: '400' }}>
            Loading marketplace...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{
      backgroundColor: '#2c2f36',
      backgroundImage: `
        radial-gradient(circle at 20% 20%, rgba(139, 139, 139, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139, 139, 139, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(139, 139, 139, 0.1) 0%, transparent 50%)
      `,
      backgroundSize: '100px 100px, 150px 150px, 80px 80px'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-2 border-gray-600 bg-gray-700 text-white hover:bg-gray-600 text-lg font-bold rounded-lg px-6 py-3 font-titan"
            style={{ fontWeight: '400' }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-6xl text-white font-bold mb-4 font-titan" style={{ fontWeight: '400' }}>
              Market
            </h1>
            <p className="text-xl text-white font-medium font-titan" style={{ fontWeight: '400' }}>
              Open packs and collect blooks!
            </p>
            <div className="mt-4">
              <TokenDisplay tokens={userTokens} />
            </div>
          </div>
          
          <div></div>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search packs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg font-medium border-2 border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 rounded-lg font-titan"
              style={{ fontWeight: '400' }}
            />
          </div>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredPacks.map(pack => (
            <Card 
              key={pack.id} 
              className="bg-gray-800 border-2 border-gray-600 rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer hover:border-gray-500"
              onClick={() => handlePackClick(pack)}
            >
              <CardContent className="p-0">
                <div className={`w-full h-48 bg-gradient-to-br ${pack.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="text-6xl relative z-10">{pack.image}</div>
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm font-titan" style={{ fontWeight: '400' }}>
                    {pack.price}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-white font-bold text-lg font-titan" style={{ fontWeight: '400' }}>
                    {pack.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pack Opening Animation */}
        {isOpening && selectedPack && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className={`w-64 h-64 bg-gradient-to-br ${selectedPack.color} rounded-lg flex items-center justify-center mb-4 animate-pulse`}>
                <div className="text-8xl">{selectedPack.image}</div>
              </div>
              <h2 className="text-white text-3xl font-bold font-titan" style={{ fontWeight: '400' }}>
                Opening {selectedPack.name}...
              </h2>
            </div>
          </div>
        )}

        {filteredPacks.length === 0 && (
          <div className="text-center text-white font-bold text-2xl mt-12 font-titan" style={{ fontWeight: '400' }}>
            No packs found matching your search
          </div>
        )}
      </div>
    </div>
  )
}
