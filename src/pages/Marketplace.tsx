
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { ShoppingCart, Lock, Unlock, Sparkles } from 'lucide-react'

interface Pack {
  id: string
  name: string
  cost: number
  image: string
  color: string
  borderColor: string
  description: string
  rarities: string[]
}

const packs: Pack[] = [
  {
    id: '1',
    name: 'Breakfast',
    cost: 25,
    image: '🥞',
    color: 'from-orange-400 to-orange-600',
    borderColor: 'border-orange-300',
    description: 'Morning treats!',
    rarities: ['common', 'uncommon']
  },
  {
    id: '2', 
    name: 'Dino',
    cost: 50,
    image: '🦕',
    color: 'from-green-400 to-green-600',
    borderColor: 'border-green-300',
    description: 'Prehistoric pals',
    rarities: ['common', 'uncommon', 'rare']
  },
  {
    id: '3',
    name: 'Bot',
    cost: 100,
    image: '🤖',
    color: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-300',
    description: 'Robotic friends!',
    rarities: ['uncommon', 'rare', 'epic']
  },
  {
    id: '4',
    name: 'Safari',
    cost: 150,
    image: '🦁',
    color: 'from-yellow-500 to-amber-600',
    borderColor: 'border-yellow-300',
    description: 'Wild animals!',
    rarities: ['rare', 'epic']
  },
  {
    id: '5',
    name: 'Aquatic',
    cost: 200,
    image: '🐠',
    color: 'from-cyan-400 to-teal-600',
    borderColor: 'border-cyan-300',
    description: 'Ocean creatures',
    rarities: ['rare', 'epic', 'legendary']
  },
  {
    id: '6',
    name: 'Ice Monster',
    cost: 300,
    image: '❄️',
    color: 'from-sky-300 to-blue-500',
    borderColor: 'border-sky-200',
    description: 'Frozen friends',
    rarities: ['epic', 'legendary']
  },
  {
    id: '7',
    name: 'Space',
    cost: 500,
    image: '🚀',
    color: 'from-purple-500 to-indigo-700',
    borderColor: 'border-purple-300',
    description: 'Galactic blooks!',
    rarities: ['legendary', 'chroma']
  },
  {
    id: '8',
    name: 'Legendary',
    cost: 1000,
    image: '✨',
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-300',
    description: 'Ultra rare!',
    rarities: ['chroma', 'mythical']
  }
]

// Custom blooks from user's image - 4x3 grid sprite positions
const blookPool = [
  // Row 1: Money Pug, Money Cat, Purple Dragon
  { id: '1', name: 'Money Pug', image: '/blooks/custom-blooks.png', imagePos: '0% 0%', rarity: 'common' },
  { id: '2', name: 'Money Cat', image: '/blooks/custom-blooks.png', imagePos: '50% 0%', rarity: 'common' },
  { id: '3', name: 'Purple Dragon', image: '/blooks/custom-blooks.png', imagePos: '100% 0%', rarity: 'rare' },
  
  // Row 2: Red Devil, Pink Alien, Ice Monster
  { id: '4', name: 'Red Devil', image: '/blooks/custom-blooks.png', imagePos: '0% 33%', rarity: 'uncommon' },
  { id: '5', name: 'Pink Alien', image: '/blooks/custom-blooks.png', imagePos: '50% 33%', rarity: 'uncommon' },
  { id: '6', name: 'Ice Monster', image: '/blooks/custom-blooks.png', imagePos: '100% 33%', rarity: 'epic' },
  
  // Row 3: Mushroom, Wizard Bird, Rainbow Narwhal
  { id: '7', name: 'Mushroom', image: '/blooks/custom-blooks.png', imagePos: '0% 66%', rarity: 'rare' },
  { id: '8', name: 'Wizard Bird', image: '/blooks/custom-blooks.png', imagePos: '50% 66%', rarity: 'epic' },
  { id: '9', name: 'Rainbow Narwhal', image: '/blooks/custom-blooks.png', imagePos: '100% 66%', rarity: 'legendary' },
  
  // Row 4: Strawberry, Unicorn Cube, Purple Octopus
  { id: '10', name: 'Strawberry', image: '/blooks/custom-blooks.png', imagePos: '0% 100%', rarity: 'common' },
  { id: '11', name: 'Unicorn Cube', image: '/blooks/custom-blooks.png', imagePos: '50% 100%', rarity: 'legendary' },
  { id: '12', name: 'Purple Octopus', image: '/blooks/custom-blooks.png', imagePos: '100% 100%', rarity: 'chroma' },
]

// Emoji fallback blooks mapped to custom blooks
const emojiBlooks = [
  { id: 'e1', name: 'Money Pug', image: '🐶', spriteImage: '/blooks/custom-blooks.png', imagePos: '0% 0%', rarity: 'common' },
  { id: 'e2', name: 'Money Cat', image: '🐱', spriteImage: '/blooks/custom-blooks.png', imagePos: '50% 0%', rarity: 'common' },
  { id: 'e3', name: 'Strawberry', image: '🍓', spriteImage: '/blooks/custom-blooks.png', imagePos: '0% 100%', rarity: 'common' },
  { id: 'e4', name: 'Red Devil', image: '😈', spriteImage: '/blooks/custom-blooks.png', imagePos: '0% 33%', rarity: 'uncommon' },
  { id: 'e5', name: 'Pink Alien', image: '👾', spriteImage: '/blooks/custom-blooks.png', imagePos: '50% 33%', rarity: 'uncommon' },
  { id: 'e6', name: 'Purple Dragon', image: '🐲', spriteImage: '/blooks/custom-blooks.png', imagePos: '100% 0%', rarity: 'rare' },
  { id: 'e7', name: 'Mushroom', image: '🍄', spriteImage: '/blooks/custom-blooks.png', imagePos: '0% 66%', rarity: 'rare' },
  { id: 'e8', name: 'Ice Monster', image: '🧊', spriteImage: '/blooks/custom-blooks.png', imagePos: '100% 33%', rarity: 'epic' },
  { id: 'e9', name: 'Wizard Bird', image: '🧙', spriteImage: '/blooks/custom-blooks.png', imagePos: '50% 66%', rarity: 'epic' },
  { id: 'e10', name: 'Rainbow Narwhal', image: '🦄', spriteImage: '/blooks/custom-blooks.png', imagePos: '100% 66%', rarity: 'legendary' },
  { id: 'e11', name: 'Unicorn Cube', image: '✨', spriteImage: '/blooks/custom-blooks.png', imagePos: '50% 100%', rarity: 'legendary' },
  { id: 'e12', name: 'Purple Octopus', image: '🐙', spriteImage: '/blooks/custom-blooks.png', imagePos: '100% 100%', rarity: 'chroma' },
  { id: 'e13', name: 'Cosmic Dragon', image: '🌟', spriteImage: '/blooks/custom-blooks.png', imagePos: '100% 0%', rarity: 'mythical' },
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

  const loadUserTokens = () => {
    const existingUsers = JSON.parse(localStorage.getItem('oranget_users') || '{}')
    const userKey = Object.keys(existingUsers).find(
      key => existingUsers[key].userData.id === user?.id
    )
    if (userKey) {
      setTokens(existingUsers[userKey].userData.tokens || 0)
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
    let selectedRarity = packRarities[0]
    
    for (const [rarity, weight] of Object.entries(weights)) {
      currentWeight += weight
      if (random <= currentWeight) {
        selectedRarity = rarity
        break
      }
    }
    
    // Use emoji blooks as they work better
    const availableBlooks = emojiBlooks.filter(blook => 
      blook.rarity === selectedRarity && packRarities.includes(blook.rarity)
    )
    
    if (availableBlooks.length === 0) {
      return emojiBlooks.find(blook => packRarities.includes(blook.rarity)) || emojiBlooks[0]
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
    
    // Deduct tokens from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('oranget_users') || '{}')
    const userKey = Object.keys(existingUsers).find(
      key => existingUsers[key].userData.id === user?.id
    )
    
    if (userKey) {
      existingUsers[userKey].userData.tokens -= pack.cost
      localStorage.setItem('oranget_users', JSON.stringify(existingUsers))
      localStorage.setItem('oranget_user', JSON.stringify(existingUsers[userKey].userData))
      setTokens(existingUsers[userKey].userData.tokens)
    }

    // Animation sequence
    setTimeout(() => {
      setAnimationStage('key')
      
      setTimeout(() => {
        setAnimationStage('unlock')
        
        setTimeout(() => {
          const newBlook = selectRandomBlook(pack.rarities)
          setRewardBlook(newBlook)
          setAnimationStage('reveal')
          
          // Add blook to user's collection
          const userBlooks = JSON.parse(localStorage.getItem(`oranget_blooks_${user?.id}`) || '[]')
          userBlooks.push(newBlook)
          localStorage.setItem(`oranget_blooks_${user?.id}`, JSON.stringify(userBlooks))
          
          setTimeout(() => {
            setShowReward(true)
            setOpeningPack(null)
          }, 500)
        }, 1000)
      }, 1000)
    }, 800)
  }

  const closeReward = () => {
    setShowReward(false)
    setRewardBlook(null)
    setAnimationStage('lock')
  }

  const getRarityColor = (rarity: string) => {
    const colors: { [key: string]: string } = {
      common: 'text-gray-300',
      uncommon: 'text-green-400',
      rare: 'text-blue-400',
      epic: 'text-purple-400',
      legendary: 'text-yellow-400',
      chroma: 'text-pink-400',
      mythical: 'text-red-400'
    }
    return colors[rarity] || 'text-white'
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
                <h1 className="text-4xl text-white font-bold drop-shadow-lg titan-one-light">Market</h1>
                <p className="text-orange-100 mt-1 font-medium titan-one-light">Open packs to get blooks!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400 text-orange-800 px-4 py-2 rounded-2xl font-bold titan-one-light text-lg">
                🪙 {tokens.toLocaleString()}
              </div>
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              {/* Blooket-style pack grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {packs.map((pack) => (
                  <div
                    key={pack.id}
                    onClick={() => !openingPack && openPack(pack)}
                    className={`
                      relative cursor-pointer group
                      ${openingPack === pack.id ? 'pointer-events-none' : ''}
                    `}
                  >
                    {/* Pack card - notebook style */}
                    <div className={`
                      bg-gradient-to-br ${pack.color}
                      rounded-2xl border-4 ${pack.borderColor}
                      p-4 transition-all duration-300
                      group-hover:scale-105 group-hover:shadow-2xl
                      ${openingPack === pack.id ? 'animate-pulse' : ''}
                    `}>
                      {/* Spiral binding effect */}
                      <div className="absolute left-2 top-4 bottom-4 w-1 flex flex-col justify-around">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="w-3 h-3 bg-white/30 rounded-full -ml-1" />
                        ))}
                      </div>
                      
                      {/* Pack content */}
                      <div className="text-center pl-2">
                        <div className="text-5xl mb-2">
                          {openingPack === pack.id ? (
                            <div className="relative">
                              {animationStage === 'lock' && <Lock className="w-12 h-12 mx-auto text-white animate-pulse" />}
                              {animationStage === 'key' && <span className="animate-bounce inline-block">🔑</span>}
                              {animationStage === 'unlock' && <Unlock className="w-12 h-12 mx-auto text-white animate-spin" />}
                              {animationStage === 'reveal' && rewardBlook && (
                                <span className="animate-bounce inline-block text-6xl">{rewardBlook.image}</span>
                              )}
                            </div>
                          ) : (
                            pack.image
                          )}
                        </div>
                        <h3 className="text-white font-bold titan-one-light text-lg drop-shadow-lg">
                          {pack.name}
                        </h3>
                        <p className="text-white/80 text-xs titan-one-light mb-2">
                          {pack.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Price tag */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-500 px-4 py-1 rounded-full border-2 border-orange-300 flex items-center space-x-1">
                      <span className="text-yellow-300">🪙</span>
                      <span className="text-white font-bold titan-one-light text-sm">{pack.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reward Modal */}
          {showReward && rewardBlook && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-8 m-4 text-center border-4 border-orange-300 animate-scale-in max-w-sm">
                <Sparkles className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <h2 className="text-3xl text-white font-bold mb-4 titan-one-light">
                  You Got:
                </h2>
                <div className="w-32 h-32 mx-auto mb-4 animate-bounce">
                  {rewardBlook.spriteImage ? (
                    <div 
                      className="w-full h-full rounded-xl"
                      style={{
                        backgroundImage: `url(${rewardBlook.spriteImage})`,
                        backgroundPosition: rewardBlook.imagePos,
                        backgroundSize: '300% 400%',
                      }}
                    />
                  ) : (
                    <span className="text-8xl">{rewardBlook.image}</span>
                  )}
                </div>
                <h3 className="text-2xl text-white font-bold mb-2 titan-one-light">
                  {rewardBlook.name}
                </h3>
                <p className={`text-lg mb-6 titan-one-light capitalize font-bold ${getRarityColor(rewardBlook.rarity)}`}>
                  {rewardBlook.rarity}
                </p>
                <Button
                  onClick={closeReward}
                  className="bg-yellow-400 hover:bg-yellow-500 text-orange-800 px-8 py-3 titan-one-light font-bold rounded-xl text-lg"
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
