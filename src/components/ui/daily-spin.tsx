
import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Gift, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const DAILY_REWARDS = [
  { tokens: 50, probability: 0.4 },
  { tokens: 100, probability: 0.3 },
  { tokens: 200, probability: 0.2 },
  { tokens: 500, probability: 0.08 },
  { tokens: 1000, probability: 0.02 }
];

export function DailySpin() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [spinning, setSpinning] = useState(false)
  const [canSpin, setCanSpin] = useState(true)

  const handleSpin = async () => {
    if (!user || spinning || !canSpin) return

    setSpinning(true)
    
    try {
      // Check if user already spun today
      const today = new Date().toDateString()
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
        throw profileError
      }

      // Check last spin date if it exists
      if (profile?.updated_at) {
        const lastSpinDate = new Date(profile.updated_at).toDateString()
        if (lastSpinDate === today) {
          toast({
            title: "Already spun today!",
            description: "Come back tomorrow for another spin!",
            variant: "destructive"
          })
          setCanSpin(false)
          setSpinning(false)
          return
        }
      }

      // Calculate reward
      const random = Math.random()
      let cumulativeProbability = 0
      let reward = DAILY_REWARDS[0]

      for (const item of DAILY_REWARDS) {
        cumulativeProbability += item.probability
        if (random <= cumulativeProbability) {
          reward = item
          break
        }
      }

      // Update user tokens
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          tokens: (profile?.tokens || 0) + reward.tokens,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      toast({
        title: "🎉 Daily Spin Complete!",
        description: `You won ${reward.tokens} tokens!`,
      })

      setCanSpin(false)
    } catch (error: any) {
      console.error('Error with daily spin:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to complete daily spin",
        variant: "destructive"
      })
    } finally {
      setSpinning(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-4 border-purple-300">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2 text-2xl font-titan">
          <Sparkles className="w-6 h-6" />
          <span>Daily Spin</span>
          <Sparkles className="w-6 h-6" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4">
          <Gift className="w-16 h-16 mx-auto mb-2" />
          <p className="text-lg opacity-90 font-titan">
            Spin once per day for free tokens!
          </p>
        </div>
        <Button
          onClick={handleSpin}
          disabled={!canSpin || spinning}
          className="bg-white text-purple-600 hover:bg-purple-50 text-lg font-titan py-3 px-6"
        >
          {spinning ? "Spinning..." : canSpin ? "Spin Now!" : "Come Back Tomorrow"}
        </Button>
      </CardContent>
    </Card>
  )
}
