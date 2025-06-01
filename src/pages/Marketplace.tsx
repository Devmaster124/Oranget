
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ShoppingCart, Star, Filter } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { TokenDisplay } from '@/components/TokenDisplay'
import { RarityBadge } from '@/components/RarityBadge'

interface MarketplaceItem {
  id: string
  name: string
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
  price: number
  description: string
  image_url?: string
  seller_id?: string
  seller_username?: string
}

export default function Marketplace() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRarity, setSelectedRarity] = useState<string>('All')
  const [userTokens, setUserTokens] = useState(0)
  const [loading, setLoading] = useState(true)

  const rarities = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']

  useEffect(() => {
    if (user) {
      fetchUserTokens()
      fetchMarketplaceItems()
    }
  }, [user])

  const fetchUserTokens = async () => {
    if (!user) return
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('tokens')
      .eq('id', user.id)
      .single()
    
    setUserTokens(profile?.tokens || 0)
  }

  const fetchMarketplaceItems = async () => {
    setLoading(true)
    
    // Mock marketplace items for now
    const mockItems: MarketplaceItem[] = [
      {
        id: '1',
        name: 'Golden Dragon',
        rarity: 'Legendary',
        price: 5000,
        description: 'A majestic golden dragon with incredible power'
      },
      {
        id: '2',
        name: 'Ice Phoenix',
        rarity: 'Epic',
        price: 2500,
        description: 'A rare ice phoenix that brings good fortune'
      },
      {
        id: '3',
        name: 'Forest Guardian',
        rarity: 'Rare',
        price: 1000,
        description: 'A protective spirit of the forest'
      },
      {
        id: '4',
        name: 'Lightning Bolt',
        rarity: 'Uncommon',
        price: 500,
        description: 'Harness the power of lightning'
      },
      {
        id: '5',
        name: 'Magic Wand',
        rarity: 'Common',
        price: 100,
        description: 'A simple but effective magic wand'
      }
    ]
    
    setItems(mockItems)
    setLoading(false)
  }

  const handlePurchase = async (item: MarketplaceItem) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to make purchases",
        variant: "destructive"
      })
      return
    }

    if (userTokens < item.price) {
      toast({
        title: "Insufficient tokens",
        description: `You need ${item.price - userTokens} more tokens to purchase this item`,
        variant: "destructive"
      })
      return
    }

    try {
      // Update user tokens
      const newTokenAmount = userTokens - item.price
      const { error } = await supabase
        .from('profiles')
        .update({ tokens: newTokenAmount })
        .eq('id', user.id)

      if (error) throw error

      setUserTokens(newTokenAmount)
      
      toast({
        title: "Purchase successful!",
        description: `You bought ${item.name} for ${item.price} tokens`,
      })
    } catch (error: any) {
      console.error('Purchase error:', error)
      toast({
        title: "Purchase failed",
        description: error.message || "Failed to complete purchase",
        variant: "destructive"
      })
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRarity = selectedRarity === 'All' || item.rarity === selectedRarity
    return matchesSearch && matchesRarity
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white font-titan text-2xl">Loading marketplace...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl text-white font-titan mb-4">🛍️ MARKETPLACE</h1>
          <p className="text-xl text-white font-titan">Buy amazing items with your tokens!</p>
          <div className="mt-4">
            <TokenDisplay tokens={userTokens} />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg font-titan border-4 border-white/30 rounded-2xl"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-white w-5 h-5" />
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-4 py-2 border-4 border-white/30 rounded-2xl font-titan text-lg bg-white/10 text-white"
            >
              {rarities.map(rarity => (
                <option key={rarity} value={rarity} className="text-black">
                  {rarity}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="bg-white/20 backdrop-blur-sm border-4 border-white/30 rounded-3xl overflow-hidden hover:scale-105 transition-transform">
              <CardHeader className="text-center">
                <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl mb-4 flex items-center justify-center">
                  <Star className="w-16 h-16 text-white" />
                </div>
                <CardTitle className="text-white font-titan text-xl">{item.name}</CardTitle>
                <RarityBadge rarity={item.rarity} />
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-white/80 font-titan">{item.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-titan text-lg px-4 py-2">
                    {item.price} 🪙
                  </Badge>
                  <Button
                    onClick={() => handlePurchase(item)}
                    disabled={userTokens < item.price}
                    className="bg-green-500 hover:bg-green-600 text-white font-titan rounded-2xl px-6"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center text-white font-titan text-2xl mt-12">
            No items found matching your criteria
          </div>
        )}
      </div>
    </div>
  )
}
