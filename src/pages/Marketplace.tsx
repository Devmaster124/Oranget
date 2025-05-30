
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { TokenDisplay } from '@/components/TokenDisplay'
import { ShoppingCart, Sparkles, Coins, Gift } from 'lucide-react'

export default function Marketplace() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [packs, setPacks] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [opening, setOpening] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      // Fetch packs
      const { data: packsData, error: packsError } = await supabase
        .from('packs')
        .select('*')
        .order('token_cost', { ascending: true })
      
      if (packsError) throw packsError
      setPacks(packsData || [])

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()
      
      if (profileError) throw profileError
      setProfile(profileData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const openPack = async (pack: any) => {
    if (!profile || profile.tokens < pack.token_cost) {
      toast({
        title: "Not enough tokens!",
        description: `You need ${pack.token_cost} tokens to open this pack.`,
        variant: "destructive"
      })
      return
    }

    setOpening(pack.id)
    
    try {
      // Get blooks from this pack
      const { data: packBlooks, error: blooksError } = await supabase
        .from('blooks')
        .select('*')
        .eq('pack_id', pack.id)
      
      if (blooksError) throw blooksError
      
      if (!packBlooks || packBlooks.length === 0) {
        throw new Error('No blooks in this pack')
      }

      // Simulate pack opening with weighted random selection
      const weights = pack.rarity_weights || {
        common: 70, uncommon: 20, rare: 7, epic: 2, legendary: 0.9, chroma: 0.1
      }
      
      const totalWeight = Object.values(weights).reduce((a: any, b: any) => a + b, 0)
      const random = Math.random() * totalWeight
      let currentWeight = 0
      let selectedRarity = 'common'
      
      for (const [rarity, weight] of Object.entries(weights)) {
        currentWeight += weight as number
        if (random <= currentWeight) {
          selectedRarity = rarity
          break
        }
      }
      
      // Get a random blook of the selected rarity
      const rarityBlooks = packBlooks.filter(b => b.rarity === selectedRarity)
      const selectedBlook = rarityBlooks[Math.floor(Math.random() * rarityBlooks.length)] || packBlooks[0]
      
      // Add blook to user's collection (if not already owned)
      const { error: insertError } = await supabase
        .from('user_blooks')
        .insert({
          user_id: user?.id,
          blook_id: selectedBlook.id
        })
      
      // Update user tokens and blooks count
      const newTokens = profile.tokens - pack.token_cost
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          tokens: newTokens,
          blooks_unlocked: (profile.blooks_unlocked || 0) + (insertError ? 0 : 1)
        })
        .eq('id', user?.id)
      
      if (updateError) throw updateError
      
      // Update local state
      setProfile({
        ...profile,
        tokens: newTokens,
        blooks_unlocked: (profile.blooks_unlocked || 0) + (insertError ? 0 : 1)
      })
      
      // Show result
      toast({
        title: insertError ? "Duplicate blook!" : "Pack opened! 🎉",
        description: insertError 
          ? `You got ${selectedBlook.name} but you already own it!`
          : `You got a ${selectedRarity} ${selectedBlook.name}!`,
      })
      
    } catch (error) {
      console.error('Error opening pack:', error)
      toast({
        title: "Error",
        description: "Failed to open pack. Please try again.",
        variant: "destructive"
      })
    } finally {
      setOpening(null)
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 font-fredoka">
          <AppSidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-orange-600 text-xl font-bold">Loading marketplace...</p>
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
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
                  <h1 className="text-4xl font-fredoka text-orange-600 font-black drop-shadow-lg">
                    🛒 Marketplace
                  </h1>
                  <p className="text-orange-500 mt-1 font-bold">Open packs and collect blooks!</p>
                </div>
              </div>
              {profile && <TokenDisplay tokens={profile.tokens} orangeDrips={profile.orange_drips} />}
            </div>

            {/* Packs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packs.map((pack) => (
                <Card 
                  key={pack.id}
                  className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={pack.image_url || 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400'} 
                      alt={pack.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-orange-500 text-white border-2 border-orange-300 font-black text-lg px-3 py-1">
                        <Gift className="w-4 h-4 mr-1" />
                        PACK
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-2xl text-orange-600 font-black">{pack.name}</CardTitle>
                    <p className="text-orange-500 font-bold">{pack.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Coins className="w-6 h-6 text-yellow-600" />
                        <span className="text-2xl font-black text-orange-700">{pack.token_cost}</span>
                        <span className="text-orange-600 font-bold">tokens</span>
                      </div>
                      {pack.orange_drip_cost > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🧡</span>
                          <span className="text-lg font-black text-orange-700">{pack.orange_drip_cost}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={() => openPack(pack)}
                      disabled={!profile || profile.tokens < pack.token_cost || opening === pack.id}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-lg py-3 rounded-2xl border-4 border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {opening === pack.id ? (
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 animate-spin" />
                          <span>Opening...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="w-5 h-5" />
                          <span>Open Pack</span>
                        </div>
                      )}
                    </Button>
                    
                    {profile && profile.tokens < pack.token_cost && (
                      <p className="text-red-500 text-sm font-bold text-center">
                        Need {pack.token_cost - profile.tokens} more tokens!
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {packs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-orange-500 text-xl font-bold">No packs available yet!</p>
                <p className="text-orange-400 mt-2">Check back soon for new packs to open.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
