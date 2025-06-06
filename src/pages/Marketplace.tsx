
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { ShoppingCart, Lock, Unlock, Star, Crown } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"

interface Pack {
  id: string
  name: string
  cost: number
  image: string
  description: string
  rarities: string[]
}

const packs: Pack[] = [
  {
    id: '1',
    name: 'Common Pack',
    cost: 25,
    image: '📦',
    description: 'Basic pack with common blooks',
    rarities: ['common', 'uncommon']
  },
  {
    id: '2', 
    name: 'Rare Pack',
    cost: 100,
    image: '🎁',
    description: 'Better chance for rare blooks',
    rarities: ['common', 'uncommon', 'rare', 'epic']
  },
  {
    id: '3',
    name: 'Epic Pack', 
    cost: 250,
    image: '💎',
    description: 'High chance for epic and legendary blooks',
    rarities: ['rare', 'epic', 'legendary', 'chroma']
  },
  {
    id: '4',
    name: 'Mythical Pack',
    cost: 500,
    image: '🌟',
    description: 'Ultra rare pack with mythical blooks',
    rarities: ['legendary', 'chroma', 'mythical']
  }
]

const blookPool = [
  // Common
  { id: '1', name: 'Orange', image: '🧡', rarity: 'common' },
  { id: '2', name: 'Apple', image: '🍎', rarity: 'common' },
  { id: '3', name: 'Banana', image: '🍌', rarity: 'common' },
  
  // Uncommon
  { id: '4', name: 'Pizza', image: '🍕', rarity: 'uncommon' },
  { id: '5', name: 'Burger', image: '🍔', rarity: 'uncommon' },
  
  // Rare
  { id: '6', name: 'Diamond', image: '💎', rarity: 'rare' },
  { id: '7', name: 'Gold', image: '🥇', rarity: 'rare' },
  
  // Epic
  { id: '8', name: 'Crown', image: '👑', rarity: 'epic' },
  { id: '9', name: 'Trophy', image: '🏆', rarity: 'epic' },
  
  // Legendary
  { id: '10', name: 'Dragon', image: '🐉', rarity: 'legendary' },
  { id: '11', name: 'Phoenix', image: '🔥', rarity: 'legendary' },
  
  // Chroma
  { id: '12', name: 'Rainbow', image: '🌈', rarity: 'chroma' },
  { id: '13', name: 'Galaxy', image: '🌌', rarity: 'chroma' },
  
  // Mythical
  { id: '14', name: 'Cosmic', image: '✨', rarity: 'mythical' },
  { id: '15', name: 'Divine', image: '⭐', rarity: 'mythical' }
]

export default function Marketplace() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [tokens, setTokens] = useState(0)
  const [openingPack, setOpeningPack] = useState<string | null>(null)
  const [rewardBlook, setRewardBlook] = useState<any>(null)
  const [showReward, setShowReward] = useState(false)
  const [animationStage, setAnimationStage] = useState<'lock' | 'key' | 'unlock' | 'reveal'>('lock')

  useEffect(() => {
    if (user) {
      loadUserTokens()
    }
  }, [user])

  const loadUserTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('tokens')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setTokens(data?.tokens || 0)
    } catch (error) {
      console.error('Error loading tokens:', error)
    }
  }

  const getRarityWeights = (packRarities: string[]) => {
    const weights: { [key: string]: number } = {
      common: 60,
      uncommon: 25,
      rare: 10,
      epic: 4,
      legendary: 0.8,
      chroma: 0.15,
      mythical: 0.05
    }
    
    const availableWeights: { [key: string]: number } = {}
    packRarities.forEach(rarity => {
      if (weights[rarity]) {
        availableWeights[rarity] = weights[rarity]
      }
    })
    
    return availableWeights
  }

  const selectRandomBlook = (packRarities: string[]) => {
    const weights = getRarityWeights(packRarities)
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0)
    const random = Math.random() * totalWeight
    
    let currentWeight = 0
    let selectedRarity = 'common'
    
    for (const [rarity, weight] of Object.entries(weights)) {
      currentWeight += weight
      if (random <= currentWeight) {
        selectedRarity = rarity
        break
      }
    }
    
    const availableBlooks = blookPool.filter(blook => 
      blook.rarity === selectedRarity && packRarities.includes(blook.rarity)
    )
    
    if (availableBlooks.length === 0) {
      return blookPool.find(blook => blook.rarity === 'common') || blookPool[0]
    }
    
    return availableBlooks[Math.floor(Math.random() * availableBlooks.length)]
  }

  const openPack = async (pack: Pack) => {
    if (tokens < pack.cost) {
      toast({
        title: "Not enough tokens!",
        description: `You need ${pack.cost} tokens to open this pack.`,
        variant: "destructive"
      })
      return
    }

    setOpeningPack(pack.id)
    setAnimationStage('lock')
    
    // Deduct tokens
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tokens: tokens - pack.cost })
        .eq('id', user?.id)
      
      if (error) throw error
      setTokens(prev => prev - pack.cost)
    } catch (error) {
      console.error('Error updating tokens:', error)
      setOpeningPack(null)
      return
    }

    // Lock stage
    setTimeout(() => {
      setAnimationStage('key')
      
      // Key stage
      setTimeout(() => {
        setAnimationStage('unlock')
        
        // Unlock stage
        setTimeout(() => {
          const newBlook = selectRandomBlook(pack.rarities)
          setRewardBlook(newBlook)
          setAnimationStage('reveal')
          
          // Add blook to user's collection
          const userBlooks = JSON.parse(localStorage.getItem(`oranget_blooks_${user?.id}`) || '[]')
          userBlooks.push(newBlook)
          localStorage.setItem(`oranget_blooks_${user?.id}`, JSON.stringify(userBlooks))
          
          // Show reward
          setTimeout(() => {
            setShowReward(true)
            setOpeningPack(null)
          }, 500)
        }, 1000)
      }, 1500)
    }, 1000)
  }

  const closeReward = () => {
    setShowReward(false)
    setRewardBlook(null)
    setAnimationStage('lock')
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        <div className="falling-blooks"></div>
        
        <AppSidebar />
        
        <main className="flex-1 relative z-10">
          <div className="flex items-center justify-between p-6 bg-orange-600/80 backdrop-blur-sm border-b-4 border-orange-300">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-orange-700 rounded-xl text-white" />
              <div>
                <h1 className="text-4xl text-white font-bold drop-shadow-lg titan-one-light">Marketplace</h1>
                <p className="text-orange-100 mt-1 font-medium titan-one-light">Open packs to get blooks!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400 text-orange-800 px-4 py-2 rounded-2xl font-bold titan-one-light">
                🪙 {tokens}
              </div>
              <ShoppingCart className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packs.map((pack) => (
                  <Card 
                    key={pack.id} 
                    className={`blacket-card transition-all duration-300 hover:scale-105 ${
                      openingPack === pack.id ? 'pack-explode' : ''
                    }`}
                  >
                    <CardHeader className="text-center">
                      <div className="text-6xl mb-4 relative">
                        {openingPack === pack.id ? (
                          <div className="relative">
                            {animationStage === 'lock' && (
                              <div className="animate-pulse">
                                <Lock className="w-16 h-16 mx-auto text-white" />
                              </div>
                            )}
                            {animationStage === 'key' && (
                              <div className="key-unlock">
                                🔑
                              </div>
                            )}
                            {animationStage === 'unlock' && (
                              <div className="lock-break">
                                <Unlock className="w-16 h-16 mx-auto text-white" />
                              </div>
                            )}
                            {animationStage === 'reveal' && rewardBlook && (
                              <div className="animate-bounce text-6xl">
                                {rewardBlook.image}
                              </div>
                            )}
                          </div>
                        ) : (
                          pack.image
                        )}
                      </div>
                      <CardTitle className="text-white font-bold titan-one-light">
                        {pack.name}
                      </CardTitle>
                      <p className="text-orange-200 text-sm titan-one-light">
                        {pack.description}
                      </p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="mb-4">
                        <div className="flex justify-center space-x-1 mb-2">
                          {pack.rarities.map((rarity, index) => (
                            <div key={index} className="flex items-center">
                              {rarity === 'legendary' || rarity === 'chroma' || rarity === 'mythical' ? (
                                <Crown className="w-3 h-3 text-yellow-400" />
                              ) : rarity === 'epic' ? (
                                <Crown className="w-3 h-3 text-purple-400" />
                              ) : (
                                <Star className="w-3 h-3 text-blue-400" />
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-orange-200 text-xs titan-one-light">
                          {pack.rarities.join(', ')}
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => openPack(pack)}
                        disabled={tokens < pack.cost || openingPack === pack.id}
                        className="w-full blacket-button font-bold titan-one-light"
                      >
                        {openingPack === pack.id ? (
                          'Opening...'
                        ) : (
                          <>🪙 {pack.cost}</>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Reward Modal */}
          {showReward && rewardBlook && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="blacket-card p-8 m-4 text-center animate-scale-in">
                <h2 className="text-3xl text-white font-bold mb-4 titan-one-light">
                  Congratulations! 🎉
                </h2>
                <div className="text-8xl mb-4 animate-bounce">
                  {rewardBlook.image}
                </div>
                <h3 className="text-2xl text-white font-bold mb-2 titan-one-light">
                  {rewardBlook.name}
                </h3>
                <p className="text-orange-200 mb-6 titan-one-light capitalize">
                  {rewardBlook.rarity} Rarity
                </p>
                <Button
                  onClick={closeReward}
                  className="blacket-button px-8 py-3 titan-one-light"
                >
                  Awesome!
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  )
}
