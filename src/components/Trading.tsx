
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Send, ArrowLeftRight, Check, X } from 'lucide-react'

interface TradingProps {
  tradeId: string
  isOpen: boolean
  onClose: () => void
}

export default function Trading({ tradeId, isOpen, onClose }: TradingProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [trade, setTrade] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [userBlooks, setUserBlooks] = useState<any[]>([])
  const [selectedBlooks, setSelectedBlooks] = useState<string[]>([])
  const [partnerProfile, setPartnerProfile] = useState<any>(null)

  useEffect(() => {
    if (isOpen && tradeId) {
      fetchTrade()
      fetchMessages()
      fetchUserBlooks()
      subscribeToMessages()
      subscribeToTradeUpdates()
    }
  }, [isOpen, tradeId])

  const fetchTrade = async () => {
    try {
      const { data, error } = await supabase
        .from('trade_requests')
        .select('*')
        .eq('id', tradeId)
        .single()
      
      if (error) throw error
      setTrade(data)
      
      // Fetch partner profile
      const partnerId = data.sender_id === user?.id ? data.receiver_id : data.sender_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, profile_picture')
        .eq('id', partnerId)
        .single()
      
      setPartnerProfile(profile)
    } catch (error) {
      console.error('Error fetching trade:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('trade_messages')
        .select(`
          *,
          profiles!trade_messages_sender_id_fkey(username)
        `)
        .eq('trade_id', tradeId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchUserBlooks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_blooks')
        .select(`
          *,
          blooks(name, rarity, image_url)
        `)
        .eq('user_id', user?.id)
      
      if (error) throw error
      setUserBlooks(data || [])
    } catch (error) {
      console.error('Error fetching user blooks:', error)
    }
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`trade_messages_${tradeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trade_messages',
          filter: `trade_id=eq.${tradeId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const subscribeToTradeUpdates = () => {
    const channel = supabase
      .channel(`trade_${tradeId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trade_requests',
          filter: `id=eq.${tradeId}`
        },
        (payload) => {
          setTrade(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const { error } = await supabase
        .from('trade_messages')
        .insert({
          trade_id: tradeId,
          sender_id: user?.id,
          message: newMessage.trim()
        })
      
      if (error) throw error
      setNewMessage('')
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      })
    }
  }

  const toggleBlookSelection = (blookId: string) => {
    setSelectedBlooks(prev => 
      prev.includes(blookId) 
        ? prev.filter(id => id !== blookId)
        : [...prev, blookId]
    )
  }

  const updateTradeOffer = async () => {
    try {
      const updateField = trade.sender_id === user?.id ? 'sender_blooks' : 'receiver_blooks'
      const { error } = await supabase
        .from('trade_requests')
        .update({ [updateField]: selectedBlooks })
        .eq('id', tradeId)
      
      if (error) throw error
      
      toast({
        title: "Offer updated!",
        description: "Your trade offer has been updated.",
      })
    } catch (error: any) {
      console.error('Error updating trade offer:', error)
      toast({
        title: "Error",
        description: "Failed to update trade offer.",
        variant: "destructive"
      })
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-200 border-gray-400'
      case 'uncommon': return 'bg-green-200 border-green-400'
      case 'rare': return 'bg-blue-200 border-blue-400'
      case 'epic': return 'bg-purple-200 border-purple-400'
      case 'legendary': return 'bg-yellow-200 border-yellow-400'
      case 'chroma': return 'bg-gradient-to-r from-pink-200 to-purple-200 border-pink-400'
      default: return 'bg-gray-200 border-gray-400'
    }
  }

  if (!trade || !partnerProfile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white rounded-3xl border-4 border-orange-200 max-w-4xl max-h-[80vh]">
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-orange-600 font-bold">Loading trade...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-3xl border-4 border-orange-200 max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl text-orange-600 font-black text-center flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6 mr-2" />
            Trading with {partnerProfile.username}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 h-[70vh]">
          {/* Your Blooks */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-orange-600">Your Blooks</h3>
            <ScrollArea className="h-64 border-2 border-orange-200 rounded-2xl p-4">
              <div className="grid grid-cols-3 gap-2">
                {userBlooks.map((userBlook) => (
                  <Card 
                    key={userBlook.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedBlooks.includes(userBlook.id) 
                        ? 'ring-4 ring-orange-400 scale-105' 
                        : 'hover:scale-105'
                    } ${getRarityColor(userBlook.blooks.rarity)}`}
                    onClick={() => toggleBlookSelection(userBlook.id)}
                  >
                    <CardContent className="p-2 text-center">
                      <img 
                        src={userBlook.blooks.image_url || '/placeholder.svg'} 
                        alt={userBlook.blooks.name}
                        className="w-12 h-12 mx-auto mb-1 rounded-lg"
                      />
                      <p className="text-xs font-bold truncate">{userBlook.blooks.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            
            <Button 
              onClick={updateTradeOffer}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-2xl"
            >
              Update Offer ({selectedBlooks.length} blooks)
            </Button>
          </div>

          {/* Chat */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-orange-600">Trade Chat</h3>
            
            <ScrollArea className="h-64 border-2 border-orange-200 rounded-2xl p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`p-3 rounded-2xl ${
                      message.sender_id === user?.id 
                        ? 'bg-orange-100 ml-4' 
                        : 'bg-gray-100 mr-4'
                    }`}
                  >
                    <p className="font-bold text-sm text-orange-600">
                      {message.sender_id === user?.id ? 'You' : partnerProfile.username}
                    </p>
                    <p className="text-gray-800">{message.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <form onSubmit={sendMessage} className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border-2 border-orange-200 rounded-2xl"
              />
              <Button 
                type="submit" 
                size="icon"
                className="bg-orange-500 hover:bg-orange-600 rounded-2xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Trade Actions */}
        <div className="flex justify-center space-x-4 pt-4 border-t-2 border-orange-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-2 border-red-300 text-red-600 hover:bg-red-50 font-black rounded-2xl px-8"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Trade
          </Button>
          
          <Button
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black rounded-2xl px-8"
          >
            <Check className="w-4 h-4 mr-2" />
            Confirm Trade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
