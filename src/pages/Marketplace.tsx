
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { ShoppingCart, Package, Lock, Key, Sparkles } from 'lucide-react'

interface Pack {
  id: string
  name: string
  description: string
  image: string
  cost: number
  rarity_weights: {
    common: number
    uncommon: number
    rare: number
    epic: number
    legendary: number
  }
}

interface Blook {
  id: string
  name: string
  image: string
  rarity: string
}

const blookPool: Blook[] = [
  // Common (70%)
  { id: '1', name: 'Orange Cat', image: '🧡', rarity: 'common' },
  { id: '2', name: 'Fire Fox', image: '🔥', rarity: 'common' },
  { id: '3', name: 'Star Fish', image: '⭐', rarity: 'common' },
  { id: '4', name: 'Lightning Bolt', image: '⚡', rarity: 'common' },
  { id: '5', name: 'Crystal Gem', image: '💎', rarity: 'common' },
  { id: '6', name: 'Magic Wand', image: '✨', rarity: 'common' },
  { id: '7', name: 'Golden Crown', image: '👑', rarity: 'common' },
  
  // Uncommon (20%)
  { id: '8', name: 'Rocket Ship', image: '🚀', rarity: 'uncommon' },
  { id: '9', name: 'Magic Hat', image: '🎩', rarity: 'uncommon' },
  { id: '10', name: 'Shield', image: '🛡️', rarity: 'uncommon' },
  { id: '11', name: 'Sword', image: '⚔️', rarity: 'uncommon' },
  { id: '12', name: 'Target', image: '🎯', rarity: 'uncommon' },
  
  // Rare (7%)
  { id: '13', name: 'Dragon', image: '🐉', rarity: 'rare' },
  { id: '14', name: 'Phoenix', image: '🔥', rarity: 'rare' },
  { id: '15', name: 'Unicorn', image: '🦄', rarity: 'rare' },
  { id: '16', name: 'Robot', image: '🤖', rarity: 'rare' },
  
  // Epic (2%)
  { id: '17', name: 'Galaxy', image: '🌌', rarity: 'epic' },
  { id: '18', name: 'Black Hole', image: '🕳️', rarity: 'epic' },
  { id: '19', name: 'Time Vortex', image: '🌀', rarity: 'epic' },
  
  // Legendary (0.9%)
  { id: '20', name: 'Golden Dragon', image: '🐲', rarity: 'legendary' },
  { id: '21', name: 'Rainbow Phoenix', image: '🌈', rarity: 'legendary' },
  
  // Chroma (0.1%)
  { id: '22', name: 'Prismatic Orb', image: '🔮', rarity: 'chroma' }
]

export default function Marketplace() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [packs, setPacks] = useState<Pack[]>([])
  const [userTokens, setUserTokens] = useState(0)
  const [loading, setLoading] = useState(true)
  const [openingPack, setOpeningPack] = useState<string | null>(null)
  const [packStage, setPackStage] = useState<'closed' | 'unlocking' | 'breaking' | 'opened'>('closed')
  const [revealedBlook, setRevealedBlook] = useState<Blook | null>(null)

  useEffect(() => {
    if (user) {
      loadMarketplace()
    }
  }, [user])

  const loadMarketplace = () => {
    const defaultPacks: Pack[] = [
      {
        id: '1',
        name: 'Starter Pack',
        description: 'Perfect for beginners! Common blooks with a chance for rare ones.',
        image: '📦',
        cost: 25,
        rarity_weights: {
          common: 70,
          uncommon: 20,
          rare: 7,
          epic: 2,
          legendary: 0.9
        }
      },
      {
        id: '2',
        name: 'Premium Pack',
        description: 'Higher chances for rare and epic blooks!',
        image: '🎁',
        cost: 100,
        rarity_weights: {
          common: 40,
          uncommon: 30,
          rare: 20,
          epic: 8,
          legendary: 2
        }
      },
      {
        id: '3',
        name: 'Legendary Pack',
        description: 'Best odds for legendary and chroma blooks!',
        image: '💰',
        cost: 500,
        rarity_weights: {
          common: 20,
          uncommon: 25,
          rare: 30,
          epic: 15,
          legendary: 10
        }
      }
    ]

    setPacks(defaultPacks)
    setUserTokens(user?.tokens || 0)
    setLoading(false)
  }

  const getRandomBlook = (rarityWeights: Pack['rarity_weights']): Blook => {
    const random = Math.random() * 100
    let cumulativeWeight = 0
    
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      cumulativeWeight += weight
      if (random <= cumulativeWeight) {
        const blooksOfRarity = blookPool.filter(blook => blook.rarity === rarity)
        if (blooksOfRarity.length > 0) {
          return blooksOfRarity[Math.floor(Math.random() * blooksOfRarity.length)]
        }
      }
    }
    
    // Fallback to common
    const commonBlooks = blookPool.filter(blook => blook.rarity === 'common')
    return commonBlooks[Math.floor(Math.random() * commonBlooks.length)]
  }

  const openPack = async (pack: Pack) => {
    if (userTokens < pack.cost) {
      toast({
        title: "Not enough tokens!",
        description: `You need ${pack.cost} tokens to open this pack.`,
        variant: "destructive"
      })
      return
    }

    setOpeningPack(pack.id)
    setPackStage('unlocking')

    // Stage 1: Key unlocking animation (2s)
    setTimeout(() => {
      setPackStage('breaking')
    }, 2000)

    // Stage 2: Lock breaking animation (1s)
    setTimeout(() => {
      setPackStage('opened')
      
      // Get random blook
      const blook = getRandomBlook(pack.rarity_weights)
      setRevealedBlook(blook)
      
      // Save blook to user's collection
      const userBlooks = JSON.parse(localStorage.getItem(`oranget_blooks_${user?.id}`) || '[]')
      userBlooks.push(blook)
      localStorage.setItem(`oranget_blooks_${user?.id}`, JSON.stringify(userBlooks))
      
      // Deduct tokens
      const newTokens = userTokens - pack.cost
      setUserTokens(newTokens)
      
      // Update user tokens in localStorage (in a real app this would update the database)
      if (user) {
        const updatedUser = { ...user, tokens: newTokens }
        localStorage.setItem('oranget_user', JSON.stringify(updatedUser))
      }
      
      toast({
        title: "Pack Opened!",
        description: `You got ${blook.name} (${blook.rarity})!`,
      })
    }, 3000)
  }

  const closePackResult = () => {
    setOpeningPack(null)
    setPackStage('closed')
    setRevealedBlook(null)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'uncommon': return 'from-green-400 to-green-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-yellow-400 to-yellow-600'
      case 'chroma': return 'from-pink-400 via-purple-400 to-blue-400'
      default: return 'from-orange-400 to-orange-600'
    }
  }

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
      <div className="min-h-screen flex w-full relative overflow-hidden">
        <div className="falling-blooks"></div>
        
        <AppSidebar />
        
        <main className="flex-1 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-orange-600/80 backdrop-blur-sm border-b-4 border-orange-300">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="blacket-button p-2" />
              <div>
                <h1 className="text-4xl text-white font-bold drop-shadow-lg titan-one-light">Market</h1>
                <p className="text-orange-100 mt-1 font-medium titan-one-light">Open packs to collect blooks!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-orange-400/30 rounded-2xl px-4 py-2 border-2 border-orange-300">
                <span className="text-white font-bold text-xl titan-one-light">{userTokens} 🪙</span>
              </div>
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              {/* Packs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map((pack) => (
                  <Card 
                    key={pack.id} 
                    className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl hover:scale-105 transition-all duration-300"
                  >
                    <CardHeader className="text-center">
                      <div className="text-8xl mb-4">{pack.image}</div>
                      <CardTitle className="text-2xl text-white font-bold titan-one-light">{pack.name}</CardTitle>
                      <p className="text-orange-100 titan-one-light">{pack.description}</p>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="bg-white/20 rounded-xl p-3">
                        <p className="text-3xl font-bold text-white titan-one-light">{pack.cost} 🪙</p>
                      </div>
                      <Button
                        onClick={() => openPack(pack)}
                        disabled={userTokens < pack.cost || openingPack === pack.id}
                        className="blacket-button w-full py-3 text-lg titan-one-light"
                      >
                        {openingPack === pack.id ? (
                          <div className="flex items-center space-x-2">
                            <Package className="w-5 h-5 animate-spin" />
                            <span>Opening...</span>
                          </div>
                        ) : (
                          <>Open Pack</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Pack Opening Animation Overlay */}
          {openingPack && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="text-center">
                {packStage === 'unlocking' && (
                  <div className="space-y-6">
                    <div className="text-8xl key-unlock">🔑</div>
                    <div className="text-6xl">🔒</div>
                    <p className="text-2xl text-white font-bold titan-one-light">Unlocking pack...</p>
                  </div>
                )}
                
                {packStage === 'breaking' && (
                  <div className="space-y-6">
                    <div className="text-8xl lock-break">💥</div>
                    <p className="text-2xl text-white font-bold titan-one-light">Breaking the seal...</p>
                  </div>
                )}
                
                {packStage === 'opened' && revealedBlook && (
                  <div className="space-y-6 pack-explode">
                    <div className={`w-64 h-64 mx-auto bg-gradient-to-br ${getRarityColor(revealedBlook.rarity)} rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl`}>
                      <div className="text-8xl">{revealedBlook.image}</div>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-4xl text-white font-bold titan-one-light">{revealedBlook.name}</h2>
                      <p className="text-xl text-orange-200 font-bold titan-one-light capitalize">{revealedBlook.rarity}</p>
                    </div>
                    <Button
                      onClick={closePackResult}
                      className="blacket-button px-8 py-3 text-lg titan-one-light"
                    >
                      Awesome!
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  )
}
