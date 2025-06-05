
import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { TokenDisplay } from '@/components/TokenDisplay'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

interface MarketplacePack {
  id: string
  name: string
  price: number
  color: string
  image: string
}

interface PackReward {
  name: string
  rarity: string
  image: string
  id: string
}

export default function Marketplace() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [packs, setPacks] = useState<MarketplacePack[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [userTokens, setUserTokens] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedPack, setSelectedPack] = useState<MarketplacePack | null>(null)
  const [packRewards, setPackRewards] = useState<PackReward[]>([])
  const [animationStage, setAnimationStage] = useState<'none' | 'opening' | 'unlocking' | 'revealing' | 'rewards'>('none')

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

  const generatePackRewards = (pack: MarketplacePack): PackReward[] => {
    const rewards: PackReward[] = []
    const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary']
    const blookEmojis = ['🔥', '❄️', '⚡', '🌟', '💎', '👑', '🎯', '🎨', '🎭', '🎪']
    
    // Generate 3-5 random rewards
    const numRewards = Math.floor(Math.random() * 3) + 3
    
    for (let i = 0; i < numRewards; i++) {
      const rarity = rarities[Math.floor(Math.random() * rarities.length)]
      const emoji = blookEmojis[Math.floor(Math.random() * blookEmojis.length)]
      
      rewards.push({
        id: `${pack.id}-${i}`,
        name: `${pack.name.split(' ')[0]} ${rarity.charAt(0).toUpperCase() + rarity.slice(1)}`,
        rarity,
        image: emoji
      })
    }
    
    return rewards
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
    setAnimationStage('opening')

    // Generate rewards
    const rewards = generatePackRewards(pack)
    setPackRewards(rewards)

    // Animation sequence
    setTimeout(() => {
      setAnimationStage('unlocking')
    }, 1000)

    setTimeout(() => {
      setAnimationStage('revealing')
    }, 3000)

    setTimeout(() => {
      setAnimationStage('rewards')
      
      // Save blooks to user's inventory
      const existingBlooks = JSON.parse(localStorage.getItem(`oranget_blooks_${user.id}`) || '[]')
      const updatedBlooks = [...existingBlooks, ...rewards]
      localStorage.setItem(`oranget_blooks_${user.id}`, JSON.stringify(updatedBlooks))
      
      const newTokenAmount = userTokens - pack.price
      setUserTokens(newTokenAmount)
      
      const updatedUser = { ...user, tokens: newTokenAmount }
      localStorage.setItem('oranget_user', JSON.stringify(updatedUser))
    }, 5000)
  }

  const closeRewards = () => {
    setAnimationStage('none')
    setSelectedPack(null)
    setPackRewards([])
    
    toast({
      title: "Pack opened successfully!",
      description: `You received ${packRewards.length} new blooks!`,
    })
  }

  const filteredPacks = packs.filter(pack => 
    pack.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <div className="falling-blooks"></div>
          <AppSidebar />
          <main className="flex-1 p-6 flex items-center justify-center relative z-10">
            <div className="text-center text-white titan-one-light text-2xl">
              Loading marketplace...
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="falling-blooks"></div>
        <AppSidebar />
        <main className="flex-1 p-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="blacket-button p-2" />
                <div>
                  <h1 className="text-6xl text-white font-bold mb-4 titan-one-light">
                    Market
                  </h1>
                  <p className="text-xl text-white font-medium titan-one-light">
                    Open packs and collect blooks!
                  </p>
                  <div className="mt-4">
                    <TokenDisplay tokens={userTokens} />
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex justify-center mb-8">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-300 w-5 h-5" />
                <Input
                  placeholder="Search packs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-lg font-medium blacket-card text-white placeholder:text-orange-200 titan-one-light"
                />
              </div>
            </div>

            {/* Packs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredPacks.map(pack => (
                <Card 
                  key={pack.id} 
                  className="blacket-card overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer"
                  onClick={() => handlePackClick(pack)}
                >
                  <CardContent className="p-0">
                    <div className={`w-full h-48 bg-gradient-to-br ${pack.color} flex items-center justify-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="text-6xl relative z-10">{pack.image}</div>
                      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm titan-one-light">
                        {pack.price}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="p-4 text-center bg-orange-500/20 backdrop-blur-sm">
                      <h3 className="text-white font-bold text-lg titan-one-light">
                        {pack.name}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pack Opening Animation */}
            {animationStage !== 'none' && selectedPack && (
              <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                <div className="text-center">
                  {animationStage === 'opening' && (
                    <div className="animate-pulse">
                      <div className={`w-64 h-64 bg-gradient-to-br ${selectedPack.color} rounded-lg flex items-center justify-center mb-4 relative`}>
                        <div className="text-8xl">{selectedPack.image}</div>
                        <div className="absolute inset-0 border-8 border-yellow-400 rounded-lg animate-pulse"></div>
                      </div>
                      <h2 className="text-white text-3xl font-bold titan-one-light">
                        Approaching {selectedPack.name}...
                      </h2>
                    </div>
                  )}
                  
                  {animationStage === 'unlocking' && (
                    <div className="relative">
                      <div className={`w-64 h-64 bg-gradient-to-br ${selectedPack.color} rounded-lg flex items-center justify-center mb-4 relative overflow-hidden`}>
                        <div className="text-8xl">{selectedPack.image}</div>
                        
                        {/* Animated Key */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
                          <div className="text-6xl animate-spin">🗝️</div>
                        </div>
                        
                        {/* Lock Breaking Animation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-4xl animate-ping">🔓</div>
                        </div>
                      </div>
                      <h2 className="text-white text-3xl font-bold titan-one-light">
                        Unlocking {selectedPack.name}...
                      </h2>
                      <p className="text-orange-200 text-lg titan-one-light mt-2">
                        The key is breaking the locks!
                      </p>
                    </div>
                  )}
                  
                  {animationStage === 'revealing' && (
                    <div className="relative">
                      <div className={`w-64 h-64 bg-gradient-to-br ${selectedPack.color} rounded-lg flex items-center justify-center mb-4 relative animate-pulse scale-110`}>
                        <div className="text-8xl animate-bounce">{selectedPack.image}</div>
                        
                        {/* Explosion Effect */}
                        <div className="absolute inset-0 bg-white/20 rounded-lg animate-ping"></div>
                        <div className="absolute -inset-4 bg-yellow-400/30 rounded-full animate-ping"></div>
                      </div>
                      <h2 className="text-white text-3xl font-bold titan-one-light animate-pulse">
                        Pack Opening!
                      </h2>
                      <p className="text-orange-200 text-lg titan-one-light mt-2">
                        Here come your blooks...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pack Rewards Display */}
            {animationStage === 'rewards' && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="blacket-card p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                  <h2 className="text-white text-3xl font-bold titan-one-light text-center mb-6">
                    You got {packRewards.length} new blooks!
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    {packRewards.map((reward, index) => (
                      <div 
                        key={index} 
                        className="blacket-card p-4 text-center animate-bounce"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      >
                        <div className="text-4xl mb-2 animate-pulse">{reward.image}</div>
                        <h3 className="text-white font-bold titan-one-light">{reward.name}</h3>
                        <p className="text-orange-200 text-sm titan-one-light capitalize">{reward.rarity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Button
                      onClick={closeRewards}
                      className="blacket-button px-8 py-3 text-lg titan-one-light"
                    >
                      Awesome!
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {filteredPacks.length === 0 && (
              <div className="text-center text-white font-bold text-2xl mt-12 titan-one-light">
                No packs found matching your search
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
