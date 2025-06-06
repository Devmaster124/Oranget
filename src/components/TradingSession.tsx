
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeftRight, Check, X } from 'lucide-react'

interface TradingSessionProps {
  tradeId: string
  isOpen: boolean
  onClose: () => void
}

interface TradeOffer {
  blooks: any[]
  tokens: number
}

export default function TradingSession({ tradeId, isOpen, onClose }: TradingSessionProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [trade, setTrade] = useState<any>(null)
  const [myOffer, setMyOffer] = useState<TradeOffer>({ blooks: [], tokens: 0 })
  const [theirOffer, setTheirOffer] = useState<TradeOffer>({ blooks: [], tokens: 0 })
  const [myBlooks, setMyBlooks] = useState<any[]>([])
  const [myTokens, setMyTokens] = useState(0)
  const [partnerProfile, setPartnerProfile] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [partnerReady, setPartnerReady] = useState(false)

  useEffect(() => {
    if (isOpen && tradeId) {
      loadTradeData()
      subscribeToTradeUpdates()
    }
  }, [isOpen, tradeId])

  const loadTradeData = async () => {
    try {
      // Load trade request
      const { data: tradeData } = await supabase
        .from('trade_requests')
        .select('*')
        .eq('id', tradeId)
        .single()
      
      setTrade(tradeData)
      
      // Load partner profile
      const partnerId = tradeData.sender_id === user?.id ? tradeData.receiver_id : tradeData.sender_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', partnerId)
        .single()
      
      setPartnerProfile(profile)
      
      // Load my blooks and tokens
      const userBlooks = JSON.parse(localStorage.getItem(`oranget_blooks_${user?.id}`) || '[]')
      setMyBlooks(userBlooks)
      
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('tokens')
        .eq('id', user?.id)
        .single()
      
      setMyTokens(myProfile?.tokens || 0)
      
    } catch (error) {
      console.error('Error loading trade data:', error)
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
          const updatedTrade = payload.new
          setTrade(updatedTrade)
          
          // Update offers based on trade data
          if (updatedTrade.sender_id === user?.id) {
            setMyOffer({
              blooks: updatedTrade.sender_blooks || [],
              tokens: updatedTrade.sender_tokens || 0
            })
            setTheirOffer({
              blooks: updatedTrade.receiver_blooks || [],
              tokens: updatedTrade.receiver_tokens || 0
            })
          } else {
            setMyOffer({
              blooks: updatedTrade.receiver_blooks || [],
              tokens: updatedTrade.receiver_tokens || 0
            })
            setTheirOffer({
              blooks: updatedTrade.sender_blooks || [],
              tokens: updatedTrade.sender_tokens || 0
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const updateOffer = async () => {
    try {
      const isInitiator = trade.sender_id === user?.id
      const updateData = isInitiator ? {
        sender_blooks: myOffer.blooks,
        sender_tokens: myOffer.tokens
      } : {
        receiver_blooks: myOffer.blooks,
        receiver_tokens: myOffer.tokens
      }

      const { error } = await supabase
        .from('trade_requests')
        .update(updateData)
        .eq('id', tradeId)

      if (error) throw error

      toast({
        title: "Offer Updated!",
        description: "Your trade offer has been updated.",
      })
    } catch (error: any) {
      console.error('Error updating offer:', error)
      toast({
        title: "Error",
        description: "Failed to update offer.",
        variant: "destructive"
      })
    }
  }

  const acceptTrade = async () => {
    try {
      // Update both users' inventories
      const myBlooksAfterTrade = myBlooks.filter(blook => 
        !myOffer.blooks.some(offered => offered.id === blook.id)
      ).concat(theirOffer.blooks)
      
      // Update localStorage
      localStorage.setItem(`oranget_blooks_${user?.id}`, JSON.stringify(myBlooksAfterTrade))
      
      // Update tokens in database
      const newTokens = myTokens - myOffer.tokens + theirOffer.tokens
      await supabase
        .from('profiles')
        .update({ tokens: newTokens })
        .eq('id', user?.id)

      // Mark trade as completed
      await supabase
        .from('trade_requests')
        .update({ status: 'completed' })
        .eq('id', tradeId)

      toast({
        title: "Trade Completed!",
        description: "Items have been exchanged successfully.",
      })
      
      onClose()
    } catch (error: any) {
      console.error('Error completing trade:', error)
      toast({
        title: "Error",
        description: "Failed to complete trade.",
        variant: "destructive"
      })
    }
  }

  const addBlookToOffer = (blook: any) => {
    if (!myOffer.blooks.find(b => b.id === blook.id)) {
      setMyOffer(prev => ({
        ...prev,
        blooks: [...prev.blooks, blook]
      }))
    }
  }

  const removeBlookFromOffer = (blookId: string) => {
    setMyOffer(prev => ({
      ...prev,
      blooks: prev.blooks.filter(b => b.id !== blookId)
    }))
  }

  if (!trade || !partnerProfile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gradient-to-br from-orange-500 to-orange-600 border-4 border-orange-300 rounded-3xl max-w-6xl max-h-[90vh]">
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-bold titan-one-light">Loading trade...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-orange-500 to-orange-600 border-4 border-orange-300 rounded-3xl max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-3xl text-white font-bold text-center titan-one-light">
            Trading Session
          </DialogTitle>
          <p className="text-orange-100 text-center titan-one-light">Active Trade • 73% Disputed</p>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-6 h-[60vh]">
          {/* My Offer */}
          <div className="bg-orange-400/50 rounded-2xl p-4 backdrop-blur-sm border-2 border-orange-300">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-orange-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">{user?.username?.[0] || '🧡'}</span>
              </div>
              <h3 className="text-white font-bold titan-one-light">{user?.username || 'You'}</h3>
              <p className="text-orange-100 text-sm titan-one-light">BOT'S OFFER</p>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4 min-h-[120px] p-2 bg-orange-600/30 rounded-xl">
              {myOffer.blooks.map((blook, index) => (
                <div 
                  key={index}
                  className="w-12 h-12 bg-orange-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-orange-200"
                  onClick={() => removeBlookFromOffer(blook.id)}
                >
                  <span className="text-lg">{blook.image}</span>
                </div>
              ))}
              {myOffer.tokens > 0 && (
                <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">🪙{myOffer.tokens}</span>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-orange-100 text-sm mb-2 titan-one-light">
                {isReady ? '✓ Waiting for confirmation' : '⏳ Setting up trade'}
              </p>
              <Button
                onClick={updateOffer}
                className="w-full bg-orange-300 hover:bg-orange-200 text-orange-800 font-bold rounded-xl titan-one-light"
              >
                Update Offer
              </Button>
            </div>
          </div>

          {/* Trade Center */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-orange-400/50 rounded-2xl p-6 text-center backdrop-blur-sm border-2 border-orange-300">
              <ArrowLeftRight className="w-8 h-8 text-white mx-auto mb-2" />
              <h3 className="text-white font-bold mb-2 titan-one-light">Trade Center</h3>
              <p className="text-orange-100 text-sm mb-4 titan-one-light">Drag items to trade slots</p>
              
              <div className="mb-4">
                <p className="text-white font-bold mb-2 titan-one-light">Available Items</p>
                <div className="grid grid-cols-6 gap-1 mb-4 max-h-24 overflow-y-auto">
                  {myBlooks.map((blook) => (
                    <div 
                      key={blook.id}
                      className="w-8 h-8 bg-orange-300 rounded cursor-pointer hover:bg-orange-200 flex items-center justify-center"
                      onClick={() => addBlookToOffer(blook)}
                    >
                      <span className="text-sm">{blook.image}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mb-4">
                  <label className="text-white text-sm titan-one-light">Tokens to offer:</label>
                  <input
                    type="number"
                    max={myTokens}
                    min={0}
                    value={myOffer.tokens}
                    onChange={(e) => setMyOffer(prev => ({ ...prev, tokens: parseInt(e.target.value) || 0 }))}
                    className="w-full mt-1 p-2 rounded bg-orange-300 text-orange-800 font-bold"
                  />
                </div>
              </div>
              
              <p className="text-green-300 font-bold text-sm titan-one-light">
                Trade Value: {myOffer.blooks.length * 100 + myOffer.tokens} coins
              </p>
              <p className="text-orange-200 text-xs titan-one-light">Fair trade detected</p>
            </div>
          </div>

          {/* Their Offer */}
          <div className="bg-orange-400/50 rounded-2xl p-4 backdrop-blur-sm border-2 border-orange-300">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-teal-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl text-white font-bold">{partnerProfile.username?.[0] || 'R'}</span>
              </div>
              <h3 className="text-white font-bold titan-one-light">{partnerProfile.username}</h3>
              <p className="text-orange-100 text-sm titan-one-light">YOUR OFFER</p>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4 min-h-[120px] p-2 bg-orange-600/30 rounded-xl">
              {theirOffer.blooks.map((blook, index) => (
                <div 
                  key={index}
                  className="w-12 h-12 bg-teal-300 rounded-lg flex items-center justify-center"
                >
                  <span className="text-lg">{blook.image || '🎯'}</span>
                </div>
              ))}
              {theirOffer.tokens > 0 && (
                <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">🪙{theirOffer.tokens}</span>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-orange-100 text-sm mb-2 titan-one-light">
                {partnerReady ? '✓ Ready to trade' : '⏳ Setting up trade'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 pt-4 border-t-2 border-orange-300">
          <Button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl px-8 titan-one-light"
          >
            <X className="w-4 h-4 mr-2" />
            Decline
          </Button>
          
          <Button
            onClick={acceptTrade}
            className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl px-8 titan-one-light"
          >
            <Check className="w-4 h-4 mr-2" />
            Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
