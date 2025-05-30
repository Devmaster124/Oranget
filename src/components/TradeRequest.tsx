
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Check, X, Clock } from 'lucide-react'

interface TradeRequestProps {
  tradeRequest: any
  onResponse: (accepted: boolean) => void
}

export default function TradeRequest({ tradeRequest, onResponse }: TradeRequestProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [senderProfile, setSenderProfile] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    if (tradeRequest) {
      fetchSenderProfile()
      calculateTimeLeft()
      
      const interval = setInterval(() => {
        calculateTimeLeft()
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [tradeRequest])

  const fetchSenderProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, profile_picture')
        .eq('id', tradeRequest.sender_id)
        .single()
      
      if (error) throw error
      setSenderProfile(data)
    } catch (error) {
      console.error('Error fetching sender profile:', error)
    }
  }

  const calculateTimeLeft = () => {
    const expiresAt = new Date(tradeRequest.expires_at).getTime()
    const now = new Date().getTime()
    const timeLeft = Math.max(0, Math.floor((expiresAt - now) / 1000))
    setTimeLeft(timeLeft)
  }

  const handleResponse = async (accepted: boolean) => {
    try {
      const { error } = await supabase
        .from('trade_requests')
        .update({ status: accepted ? 'accepted' : 'declined' })
        .eq('id', tradeRequest.id)
      
      if (error) throw error
      
      toast({
        title: accepted ? "Trade accepted!" : "Trade declined",
        description: accepted 
          ? "Opening trade window..." 
          : "Trade request has been declined.",
      })
      
      onResponse(accepted)
    } catch (error: any) {
      console.error('Error responding to trade:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to respond to trade request.",
        variant: "destructive"
      })
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!tradeRequest || !senderProfile) return null

  return (
    <Dialog open={true} onOpenChange={() => onResponse(false)}>
      <DialogContent className="bg-white rounded-3xl border-4 border-orange-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-orange-600 font-black text-center flex items-center justify-center">
            <Clock className="w-6 h-6 mr-2" />
            Trade Request
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6">
          <Avatar className="w-16 h-16 mx-auto border-4 border-orange-300 shadow-lg">
            <AvatarImage src={senderProfile.profile_picture} />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-xl font-black">
              {senderProfile.username[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <p className="text-lg font-black text-gray-800 mb-2">
              <span className="text-orange-600">{senderProfile.username}</span> wants to trade with you!
            </p>
            <p className="text-orange-500 font-bold">
              ⏰ Expires in: {formatTime(timeLeft)}
            </p>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={() => handleResponse(false)}
              variant="outline"
              className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 font-black rounded-2xl"
            >
              <X className="w-4 h-4 mr-2" />
              Decline
            </Button>
            
            <Button
              onClick={() => handleResponse(true)}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black rounded-2xl"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
