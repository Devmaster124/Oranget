
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Crown, Star, Sparkles } from 'lucide-react'

interface Blook {
  id: string
  name: string
  image: string
  rarity: string
}

export default function Blooks() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [blooks, setBlooks] = useState<Blook[]>([])
  const [selectedBlook, setSelectedBlook] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserBlooks()
    }
  }, [user])

  const loadUserBlooks = () => {
    const userBlooks = JSON.parse(localStorage.getItem(`oranget_blooks_${user?.id}`) || '[]')
    const userProfile = JSON.parse(localStorage.getItem(`oranget_profile_${user?.id}`) || '{}')
    
    setBlooks(userBlooks)
    setSelectedBlook(userProfile.selectedBlookPfp || null)
    setLoading(false)
  }

  const selectBlookAsPfp = (blook: Blook) => {
    if (!user) return

    const userProfile = JSON.parse(localStorage.getItem(`oranget_profile_${user.id}`) || '{}')
    userProfile.selectedBlookPfp = blook.image
    localStorage.setItem(`oranget_profile_${user.id}`, JSON.stringify(userProfile))
    
    setSelectedBlook(blook.image)
    
    toast({
      title: "Profile Picture Updated!",
      description: `${blook.name} is now your profile picture`,
    })
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'from-gray-400 to-gray-600'
      case 'uncommon':
        return 'from-green-400 to-green-600'
      case 'rare':
        return 'from-blue-400 to-blue-600'
      case 'epic':
        return 'from-purple-400 to-purple-600'
      case 'legendary':
        return 'from-yellow-400 to-yellow-600'
      default:
        return 'from-orange-400 to-orange-600'
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return null
      case 'uncommon':
        return <Star className="w-4 h-4" />
      case 'rare':
        return <Sparkles className="w-4 h-4" />
      case 'epic':
        return <Crown className="w-4 h-4" />
      case 'legendary':
        return <Crown className="w-4 h-4 text-yellow-300" />
      default:
        return null
    }
  }

  const getBlooksByRarity = () => {
    const rarities = ['legendary', 'epic', 'rare', 'uncommon', 'common']
    const grouped: { [key: string]: Blook[] } = {}
    
    rarities.forEach(rarity => {
      grouped[rarity] = blooks.filter(blook => blook.rarity.toLowerCase() === rarity)
    })
    
    return grouped
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <div className="falling-blooks"></div>
          <AppSidebar />
          <main className="flex-1 p-6 flex items-center justify-center relative z-10">
            <div className="text-center text-white titan-one-light text-2xl">
              Loading your blooks...
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  const groupedBlooks = getBlooksByRarity()

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
                    Blooks
                  </h1>
                  <p className="text-xl text-white font-medium titan-one-light">
                    Your collection • {blooks.length} blooks collected
                  </p>
                </div>
              </div>
            </div>

            {blooks.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">📦</div>
                <h2 className="text-3xl text-white font-bold mb-4 titan-one-light">
                  No Blooks Yet!
                </h2>
                <p className="text-xl text-orange-200 mb-6 titan-one-light">
                  Open some packs from the Market to start your collection!
                </p>
                <Button
                  onClick={() => window.location.href = '/marketplace'}
                  className="blacket-button px-8 py-3 text-lg titan-one-light"
                >
                  Visit Market
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedBlooks).map(([rarity, rarityBlooks]) => {
                  if (rarityBlooks.length === 0) return null
                  
                  return (
                    <div key={rarity}>
                      <div className="flex items-center space-x-3 mb-6">
                        {getRarityIcon(rarity)}
                        <h2 className="text-3xl text-white font-bold titan-one-light capitalize">
                          {rarity} ({rarityBlooks.length})
                        </h2>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {rarityBlooks.map((blook) => (
                          <Card
                            key={blook.id}
                            className={`blacket-card overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
                              selectedBlook === blook.image ? 'ring-4 ring-yellow-400 scale-105' : ''
                            }`}
                            onClick={() => selectBlookAsPfp(blook)}
                          >
                            <CardContent className="p-0">
                              <div className={`w-full h-32 bg-gradient-to-br ${getRarityColor(blook.rarity)} flex items-center justify-center relative`}>
                                <div className="text-4xl">{blook.image}</div>
                                {selectedBlook === blook.image && (
                                  <div className="absolute top-2 right-2">
                                    <Crown className="w-5 h-5 text-yellow-400" />
                                  </div>
                                )}
                                <div className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 rounded titan-one-light">
                                  {blook.rarity}
                                </div>
                              </div>
                              <div className="p-2 text-center bg-orange-500/20 backdrop-blur-sm">
                                <h3 className="text-white font-bold text-sm titan-one-light truncate">
                                  {blook.name}
                                </h3>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
