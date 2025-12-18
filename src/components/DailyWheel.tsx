
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const WHEEL_REWARDS = [
  { tokens: 5000, label: '5K', color: '#4ade80', probability: 0.30 },
  { tokens: 10000, label: '10K', color: '#60a5fa', probability: 0.25 },
  { tokens: 25000, label: '25K', color: '#a78bfa', probability: 0.20 },
  { tokens: 50000, label: '50K', color: '#f472b6', probability: 0.12 },
  { tokens: 100000, label: '100K', color: '#fbbf24', probability: 0.08 },
  { tokens: 250000, label: '250K', color: '#f97316', probability: 0.03 },
  { tokens: 500000, label: '500K', color: '#ef4444', probability: 0.015 },
  { tokens: 1000000, label: '1M', color: '#ec4899', probability: 0.005 },
];

export function DailyWheel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [spinning, setSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [wonReward, setWonReward] = useState<typeof WHEEL_REWARDS[0] | null>(null);

  useEffect(() => {
    if (user) {
      checkCanSpin();
    }
  }, [user]);

  const checkCanSpin = () => {
    const lastSpin = localStorage.getItem(`oranget_last_spin_${user?.id}`);
    if (lastSpin) {
      const lastSpinDate = new Date(lastSpin).toDateString();
      const today = new Date().toDateString();
      setCanSpin(lastSpinDate !== today);
    }
  };

  const selectReward = () => {
    const random = Math.random();
    let cumulative = 0;
    for (const reward of WHEEL_REWARDS) {
      cumulative += reward.probability;
      if (random <= cumulative) {
        return reward;
      }
    }
    return WHEEL_REWARDS[0];
  };

  const handleSpin = async () => {
    if (!user || spinning || !canSpin) return;

    setSpinning(true);
    setWonReward(null);

    const reward = selectReward();
    const rewardIndex = WHEEL_REWARDS.indexOf(reward);
    const segmentAngle = 360 / WHEEL_REWARDS.length;
    const targetAngle = 360 - (rewardIndex * segmentAngle + segmentAngle / 2);
    const spins = 5;
    const finalRotation = rotation + spins * 360 + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      // Update tokens in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('oranget_users') || '{}');
      const userKey = Object.keys(existingUsers).find(
        key => existingUsers[key].userData.id === user.id
      );
      
      if (userKey) {
        existingUsers[userKey].userData.tokens += reward.tokens;
        localStorage.setItem('oranget_users', JSON.stringify(existingUsers));
        localStorage.setItem('oranget_user', JSON.stringify(existingUsers[userKey].userData));
      }

      // Save last spin date
      localStorage.setItem(`oranget_last_spin_${user.id}`, new Date().toISOString());

      setWonReward(reward);
      setCanSpin(false);
      setSpinning(false);

      toast({
        title: "🎉 You Won!",
        description: `You got ${reward.tokens.toLocaleString()} tokens!`,
      });
    }, 4000);
  };

  return (
    <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-4 border-purple-300 rounded-3xl overflow-hidden">
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center space-x-2 text-2xl titan-one-light">
          <Sparkles className="w-6 h-6" />
          <span>Daily Wheel</span>
          <Sparkles className="w-6 h-6" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pb-6">
        <div className="relative w-64 h-64 mx-auto mb-4">
          {/* Wheel */}
          <div
            className="w-full h-full rounded-full relative transition-transform duration-[4000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${WHEEL_REWARDS.map(
                (r, i) => `${r.color} ${(i / WHEEL_REWARDS.length) * 100}% ${((i + 1) / WHEEL_REWARDS.length) * 100}%`
              ).join(', ')})`,
            }}
          >
            {WHEEL_REWARDS.map((reward, index) => {
              const angle = (index * 360) / WHEEL_REWARDS.length + 180 / WHEEL_REWARDS.length;
              return (
                <div
                  key={index}
                  className="absolute w-full h-full flex items-center justify-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <span
                    className="absolute text-white font-bold text-xs titan-one-light drop-shadow-lg"
                    style={{
                      transform: `translateY(-90px) rotate(${-angle}deg)`,
                    }}
                  >
                    {reward.label}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
          </div>
          
          {/* Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Gift className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        {wonReward && (
          <div className="mb-4 p-3 bg-white/20 rounded-xl animate-pulse">
            <p className="text-xl font-bold titan-one-light">
              🎉 {wonReward.tokens.toLocaleString()} Tokens! 🎉
            </p>
          </div>
        )}

        <Button
          onClick={handleSpin}
          disabled={!canSpin || spinning || !user}
          className="bg-yellow-400 hover:bg-yellow-500 text-purple-800 text-lg font-bold titan-one-light py-3 px-8 rounded-xl"
        >
          {spinning ? "Spinning..." : canSpin ? "SPIN!" : "Come Back Tomorrow!"}
        </Button>
        
        <p className="text-sm text-white/70 mt-2 titan-one-light">
          Min: 5,000 • Max: 1,000,000 tokens
        </p>
      </CardContent>
    </Card>
  );
}
