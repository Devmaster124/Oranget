import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface DailySpinProps {
  isOpen: boolean
  onClose: () => void
}

const rewards = [
  { type: 'tokens', amount: 100 },
  { type: 'orange_drips', amount: 5 },
  { type: 'tokens', amount: 200 },
  { type: 'orange_drips', amount: 10 },
  { type: 'tokens', amount: 500 },
  { type: 'orange_drips', amount: 20 },
  { type: 'tokens', amount: 1000 },
  { type: 'orange_drips', amount: 50 },
]

export function DailySpin({ isOpen, onClose }: DailySpinProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)

  const spin = async () => {
    if (!user || spinning) return

    setSpinning(true)
    const randomDegrees = Math.floor(Math.random() * 360)
    const totalRotation = 1800 + randomDegrees // 5 full spins + random
    setRotation(totalRotation)

    // Calculate reward based on final position
    const section = Math.floor((totalRotation % 360) / (360 / rewards.length))
    const reward = rewards[section]

    setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            [reward.type]: supabase.sql`${reward.type} + ${reward.amount}`
          })
          .eq('id', user.id)

        if (error) throw error

        toast({
          title: "Congratulations!",
          description: `You won ${reward.amount} ${reward.type === 'tokens' ? 'tokens' : 'orange drips'}!`,
        })
      } catch (error) {
        console.error('Error updating rewards:', error)
      }
      
      setSpinning(false)
      onClose()
    }, 5000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-3xl border-4 border-orange-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-orange-600 font-black text-center">
            Daily Spin
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-64 h-64 mx-auto">
          <div 
            className="absolute inset-0 rounded-full border-8 border-orange-400 bg-gradient-to-r from-orange-500 to-orange-600 transition-transform duration-5000 ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {rewards.map((_, index) => (
              <div
                key={index}
                className="absolute top-0 left-1/2 h-1/2 origin-bottom rotate-45 -translate-x-1/2 text-white font-bold"
                style={{ 
                  transform: `rotate(${(360 / rewards.length) * index}deg) translateX(-50%)` 
                }}
              >
                {rewards[index].amount} {rewards[index].type === 'tokens' ? '🪙' : '🧡'}
              </div>
            ))}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white transform rotate-45"></div>
        </div>

        <Button
          onClick={spin}
          disabled={spinning}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black rounded-2xl py-3"
        >
          {spinning ? 'Spinning...' : 'Spin!'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}