
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TokenDisplay } from "@/components/TokenDisplay"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { ShoppingCart, Package, Sparkles } from 'lucide-react'

interface Pack {
  id: string
  name: string
  description: string
  token_cost: number
  orange_drip_cost: number
  image_url: string
}

interface UserProfile {
  tokens: number
  orange_drips: number
}

export default function Marketplace() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [packs, setPacks] = useState<Pack[]>([])
  const [userProfile, setUserProfile] = useState<UserProfile>({ tokens: 0, orange_drips: 0 })
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchPacks()
      fetchUserProfile()
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

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('tokens, orange_drips')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setUserProfile(data || { tokens: 0, orange_drips: 0 })
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const purchasePack = async (pack: Pack) => {
    if (!user) return

    const totalCost = pack.token_cost + pack.orange_drip_cost
    if (userProfile.tokens < pack.token_cost || userProfile.orange_drips < pack.orange_drip_cost) {
      toast({
        title: "Insufficient funds! 💸",
        description: "You don't have enough tokens or orange drips for this pack.",
        variant: "destructive"
      })
      return
    }

    setPurchasing(pack.id)

    try {
      // Simulate pack opening with random blook
      const { data: blooksInPack } = await supabase
        .from('blooks')
        .select('*')
        .eq('pack_id', pack.id)

      if (!blooksInPack || blooksInPack.length === 0) {
        throw new Error('No blooks available in this pack')
      }

      // Simple random selection (you can implement weighted random later)
      const randomBlook = blooksInPack[Math.floor(Math.random() * blooksInPack.length)]

      // Add blook to user's collection
      const { error: blookError } = await supabase
        .from('user_blooks')
        .insert({
          user_id: user.id,
          blook_id: randomBlook.id
        })

      if (blookError && !blookError.message.includes('duplicate')) {
        throw blookError
      }

      // Update user's tokens and orange drips
      const newTokens = userProfile.tokens - pack.token_cost
      const newOrangeDrips = userProfile.orange_drips - pack.orange_drip_cost

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          tokens: newTokens,
          orange_drips: newOrangeDrips
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Update local state
      setUserProfile({
        tokens: newTokens,
        orange_drips: newOrangeDrips
      })

      toast({
        title: "Pack opened! 🎉",
        description: `You got a ${randomBlook.rarity} ${randomBlook.name}!`,
      })

    } catch (error: any) {
      console.error('Error purchasing pack:', error)
      toast({
        title: "Purchase failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      })
    } finally {
      setPurchasing(null)
    }
  }

  const getRarityColor = (cost: number) => {
    if (cost <= 20) return 'from-green-400 to-green-600'
    if (cost <= 25) return 'from-blue-400 to-blue-600'
    return 'from-purple-400 to-purple-600'
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 font-fredoka">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-100 rounded-xl" />
                <div>
                  <h1 className="text-4xl font-fredoka text-orange-600 font-black drop-shadow-lg flex items-center">
                    <ShoppingCart className="w-10 h-10 mr-3" />
                    Marketplace
                  </h1>
                  <p className="text-orange-500 mt-1 font-bold">Open packs and discover new blooks!</p>
                </div>
              </div>
              <TokenDisplay tokens={userProfile.tokens} orangeDrips={userProfile.orange_drips} />
            </div>

            {/* Packs Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-orange-600 font-bold">Loading packs...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packs.map((pack) => (
                  <Card key={pack.id} className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
                    <CardHeader className={`bg-gradient-to-r ${getRarityColor(pack.token_cost)} text-white border-b-4 border-orange-300`}>
                      <CardTitle className="text-2xl font-black flex items-center">
                        <Package className="w-8 h-8 mr-3" />
                        {pack.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl mb-4 flex items-center justify-center border-4 border-orange-300 overflow-hidden">
                        {pack.image_url ? (
                          <img src={pack.image_url} alt={pack.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center">
                            <Sparkles className="w-16 h-16 text-orange-500 mx-auto mb-2" />
                            <span className="text-orange-600 font-black">Mystery Pack!</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 font-bold mb-4 text-center">{pack.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-orange-600 font-bold">Tokens:</span>
                          <span className="text-yellow-600 font-black text-lg">{pack.token_cost}</span>
                        </div>
                        {pack.orange_drip_cost > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-orange-600 font-bold">Orange Drips:</span>
                            <span className="text-orange-600 font-black text-lg">{pack.orange_drip_cost}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => purchasePack(pack)}
                        disabled={purchasing === pack.id || userProfile.tokens < pack.token_cost || userProfile.orange_drips < pack.orange_drip_cost}
                        className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-2xl py-3 border-4 border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {purchasing === pack.id ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Opening...
                          </div>
                        ) : (
                          'Open Pack! 🎁'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
