
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Heart, Star, Sparkles, Crown, Gem, Zap } from 'lucide-react'

const rarityConfig = {
  common: { color: 'bg-gray-100 text-gray-700 border-gray-300', icon: Heart, gradient: 'from-gray-200 to-gray-300' },
  uncommon: { color: 'bg-green-100 text-green-700 border-green-300', icon: Star, gradient: 'from-green-200 to-green-300' },
  rare: { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Sparkles, gradient: 'from-blue-200 to-blue-300' },
  epic: { color: 'bg-purple-100 text-purple-700 border-purple-300', icon: Crown, gradient: 'from-purple-200 to-purple-300' },
  legendary: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Gem, gradient: 'from-yellow-200 to-yellow-300' },
  chroma: { color: 'bg-pink-100 text-pink-700 border-pink-300', icon: Zap, gradient: 'from-pink-200 via-purple-200 to-cyan-200' }
}

export default function Blooks() {
  const { user } = useAuth()
  const [userBlooks, setUserBlooks] = useState<any[]>([])
  const [allBlooks, setAllBlooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBlooks()
    }
  }, [user])

  const fetchBlooks = async () => {
    try {
      // Fetch all blooks
      const { data: blooksData, error: blooksError } = await supabase
        .from('blooks')
        .select('*')
      
      if (blooksError) throw blooksError
      setAllBlooks(blooksData || [])

      // Fetch user's blooks
      const { data: userBlooksData, error: userBlooksError } = await supabase
        .from('user_blooks')
        .select(`
          *,
          blooks:blook_id (*)
        `)
        .eq('user_id', user?.id)
      
      if (userBlooksError) throw userBlooksError
      setUserBlooks(userBlooksData || [])
    } catch (error) {
      console.error('Error fetching blooks:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasBlook = (blookId: string) => {
    return userBlooks.some(ub => ub.blook_id === blookId)
  }

  const getRarityConfig = (rarity: string) => {
    return rarityConfig[rarity as keyof typeof rarityConfig] || rarityConfig.common
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 font-fredoka">
          <AppSidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-orange-600 text-xl font-bold">Loading your blooks...</p>
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
                    💖 Your Blooks
                  </h1>
                  <p className="text-orange-500 mt-1 font-bold">
                    Collected: {userBlooks.length} / {allBlooks.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
              {Object.entries(rarityConfig).map(([rarity, config]) => {
                const count = userBlooks.filter(ub => ub.blooks?.rarity === rarity).length
                const total = allBlooks.filter(b => b.rarity === rarity).length
                const IconComponent = config.icon
                
                return (
                  <Card key={rarity} className={`bg-gradient-to-br ${config.gradient} border-2 ${config.color.split(' ')[2]} rounded-2xl hover:scale-105 transition-transform duration-300`}>
                    <CardContent className="p-4 text-center">
                      <IconComponent className="w-8 h-8 mx-auto mb-2 text-current" />
                      <p className="text-lg font-black">{count}/{total}</p>
                      <p className="text-sm font-bold capitalize">{rarity}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Blooks Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allBlooks.map((blook) => {
                const owned = hasBlook(blook.id)
                const config = getRarityConfig(blook.rarity)
                const IconComponent = config.icon
                
                return (
                  <Card 
                    key={blook.id}
                    className={`relative overflow-hidden rounded-3xl border-4 transition-all duration-300 hover:scale-105 ${
                      owned 
                        ? `bg-gradient-to-br ${config.gradient} ${config.color.split(' ')[2]} shadow-2xl` 
                        : 'bg-gray-100 border-gray-300 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="relative mb-4">
                        <div className={`w-20 h-20 mx-auto rounded-2xl border-4 ${owned ? 'border-white' : 'border-gray-400'} overflow-hidden shadow-lg`}>
                          <img 
                            src={blook.image_url || 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=200'} 
                            alt={blook.name}
                            className={`w-full h-full object-cover ${!owned && 'grayscale'}`}
                          />
                        </div>
                        {owned && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                            <Heart className="w-4 h-4 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <h3 className={`font-black text-lg mb-2 ${owned ? 'text-current' : 'text-gray-600'}`}>
                          {blook.name}
                        </h3>
                        <Badge 
                          className={`${config.color} border-2 font-bold flex items-center justify-center gap-1`}
                        >
                          <IconComponent className="w-3 h-3" />
                          {blook.rarity}
                        </Badge>
                      </div>
                      
                      {!owned && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-3xl">
                          <p className="text-white font-black text-lg drop-shadow-lg">LOCKED</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {allBlooks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-orange-500 text-xl font-bold">No blooks available yet!</p>
                <p className="text-orange-400 mt-2">Check back soon for new blooks to collect.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
