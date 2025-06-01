
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TokenDisplay } from "@/components/TokenDisplay"
import { DailySpin } from "@/components/ui/daily-spin"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Package, Sparkles, Gift } from 'lucide-react'

interface Pack {
  id: string
  name: string
  description: string
  image_url: string
  token_cost: number
  orange_drip_cost: number
  rarity_weights: any
}

interface Blook {
  id: string
  name: string
  image_url: string
  rarity: string
}

export default function Marketplace() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [packs, setPacks] = useState<Pack[]>([])
  const [tokens, setTokens] = useState(0)
  const [orangeDrips, setOrangeDrips] = useState(0)
  const [loading, setLoading] = useState(true)
  const [opening, setOpening] = useState<string | null>(null)
  const [unlockedBlook, setUnlockedBlook] = useState<Blook | null>(null)

  useEffect(() => {
    if (user) {
      fetchPacks()
      fetchUserCurrency()
    }
  }, [user])

  const fetchPacks = async () => {
    try {
      const { data, error } = await supabase
        .from('packs')
        .select('*')
        .order('token_cost', { ascending: true })

      if (error) throw error
      setPacks(data || [])
    } catch (error) {
      console.error('Error fetching packs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserCurrency = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('tokens, orange_drips')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setTokens(data?.tokens || 0)
      setOrangeDrips(data?.orange_drips || 0)
    } catch (error) {
      console.error('Error fetching user currency:', error)
    }
  }

  const selectRandomBlook = (pack: Pack) => {
    const weights = pack.rarity_weights
    const totalWeight = Object.values(weights).reduce((sum: number, weight: any) => sum + Number(weight), 0)
    let random = Math.random() * totalWeight
    
    for (const [rarity, weight] of Object.entries(weights)) {
      random -= Number(weight)
      if (random <= 0) {
        return rarity
      }
    }
    return 'common'
  }

  const openPack = async (pack: Pack) => {
    if (!user || opening) return

    const hasEnoughTokens = tokens >= pack.token_cost
    const hasEnoughOrangeDrips = orangeDrips >= pack.orange_drip_cost

    if (!hasEnoughTokens || !hasEnoughOrangeDrips) {
      toast({
        title: "Insufficient currency",
        description: `You need ${pack.token_cost} tokens${pack.orange_drip_cost > 0 ? ` and ${pack.orange_drip_cost} orange drips` : ''} to open this pack.`,
        variant: "destructive"
      })
      return
    }

    setOpening(pack.id)

    try {
      // Select random rarity
      const selectedRarity = selectRandomBlook(pack)
      
      // Get random blook of that rarity from this pack
      const { data: availableBlooks, error: blooksError } = await supabase
        .from('blooks')
        .select('*')
        .eq('pack_id', pack.id)
        .eq('rarity', selectedRarity)

      if (blooksError) throw blooksError

      if (!availableBlooks || availableBlooks.length === 0) {
        throw new Error('No blooks available for this rarity')
      }

      const randomBlook = availableBlooks[Math.floor(Math.random() * availableBlooks.length)]

      // Add blook to user's collection
      const { error: userBlookError } = await supabase
        .from('user_blooks')
        .insert({
          user_id: user.id,
          blook_id: randomBlook.id
        })

      if (userBlookError) throw userBlookError

      // Deduct currency
      const newTokens = tokens - pack.token_cost
      const newOrangeDrips = orangeDrips - pack.orange_drip_cost

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          tokens: newTokens,
          orange_drips: newOrangeDrips,
          blooks_unlocked: (await supabase.from('user_blooks').select('id').eq('user_id', user.id)).data?.length || 0
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      setTokens(newTokens)
      setOrangeDrips(newOrangeDrips)
      setUnlockedBlook(randomBlook)

      toast({
        title: "Pack opened!",
        description: `You unlocked ${randomBlook.name}!`,
      })
    } catch (error: any) {
      console.error('Error opening pack:', error)
      toast({
        title: "Error opening pack",
        description: error.message || "Please try again.",
        variant: "destructive"
      })
    } finally {
      setOpening(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-orange-600 text-2xl font-black">Loading marketplace...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 to-orange-100">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-100 rounded-xl" />
                <div>
                  <h1 className="text-5xl text-orange-600 font-black">Marketplace</h1>
                  <p className="text-orange-500 mt-1 text-xl">Open packs and collect amazing blooks!</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <TokenDisplay tokens={tokens} orangeDrips={orangeDrips} />
              </div>
            </div>

            {/* Daily Spin */}
            <div className="mb-8">
              <DailySpin />
            </div>

            {/* Packs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packs.map((pack) => (
                <Card 
                  key={pack.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-orange-200 bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={pack.image_url} 
                      alt={pack.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Package className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-3xl text-orange-600 font-black">{pack.name}</CardTitle>
                    <p className="text-orange-500 text-lg">{pack.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-black text-gray-600">Cost:</span>
                        <div className="flex items-center space-x-2">
                          {pack.token_cost > 0 && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-lg py-2 px-4">
                              {pack.token_cost} tokens
                            </Badge>
                          )}
                          {pack.orange_drip_cost > 0 && (
                            <Badge variant="secondary" className="bg-orange-200 text-orange-800 text-lg py-2 px-4">
                              {pack.orange_drip_cost} drips
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => openPack(pack)}
                      disabled={opening === pack.id || tokens < pack.token_cost || orangeDrips < pack.orange_drip_cost}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xl font-black py-4"
                    >
                      {opening === pack.id ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Opening...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Gift className="w-5 h-5" />
                          <span>Open Pack</span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Unlocked Blook Modal */}
            {unlockedBlook && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="bg-white rounded-3xl max-w-md w-full">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-4xl text-orange-600 font-black">Congratulations!</CardTitle>
                    <p className="text-orange-500 text-xl">You unlocked a new blook!</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6 mb-6">
                      <img 
                        src={unlockedBlook.image_url} 
                        alt={unlockedBlook.name}
                        className="w-24 h-24 mx-auto mb-4 rounded-lg"
                      />
                      <h3 className="text-2xl font-black text-orange-700">{unlockedBlook.name}</h3>
                      <p className="text-orange-600 text-lg capitalize">{unlockedBlook.rarity}</p>
                    </div>
                    <Button 
                      onClick={() => setUnlockedBlook(null)}
                      className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white text-xl font-black py-4"
                    >
                      Awesome!
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
