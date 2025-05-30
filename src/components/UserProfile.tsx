
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { UserPlus, MessageCircle, Trophy, Heart, Coins } from 'lucide-react'

interface UserProfileProps {
  userId: string
  username: string
  isOpen: boolean
  onClose: () => void
  onTradeRequest: (userId: string, username: string) => void
}

export default function UserProfile({ userId, username, isOpen, onClose, onTradeRequest }: UserProfileProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'friends'>('none')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile()
      checkFriendStatus()
    }
  }, [isOpen, userId])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkFriendStatus = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('friends')
        .select('status')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${userId}),and(user_id.eq.${userId},friend_id.eq.${user.id})`)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        setFriendStatus(data.status === 'accepted' ? 'friends' : 'pending')
      }
    } catch (error) {
      console.error('Error checking friend status:', error)
    }
  }

  const sendFriendRequest = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: userId,
          status: 'pending'
        })
      
      if (error) throw error
      
      setFriendStatus('pending')
      toast({
        title: "Friend request sent!",
        description: `Your friend request has been sent to ${username}.`,
      })
    } catch (error: any) {
      console.error('Error sending friend request:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to send friend request.",
        variant: "destructive"
      })
    }
  }

  const handleTradeRequest = () => {
    onTradeRequest(userId, username)
    onClose()
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white rounded-3xl border-4 border-orange-200 max-w-md">
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-orange-600 font-bold">Loading profile...</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-3xl border-4 border-orange-200 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-orange-600 font-black text-center">
            User Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-orange-300 shadow-lg">
              <AvatarImage src={profile?.profile_picture} />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-black">
                {username[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-black text-orange-700">{username}</h3>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300">
              <CardContent className="p-4 text-center">
                <Coins className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-xl font-black text-orange-700">{profile?.tokens || 0}</p>
                <p className="text-orange-600 text-sm font-bold">Tokens</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-100 to-orange-200 border-2 border-orange-300">
              <CardContent className="p-4 text-center">
                <div className="text-xl mb-2">🧡</div>
                <p className="text-xl font-black text-orange-700">{profile?.orange_drips || 0}</p>
                <p className="text-orange-600 text-sm font-bold">Orange Drips</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200">
              <CardContent className="p-4 text-center">
                <Heart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-black text-purple-700">{profile?.blooks_unlocked || 0}</p>
                <p className="text-purple-600 text-xs font-bold">Blooks</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200">
              <CardContent className="p-4 text-center">
                <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-black text-green-700">{profile?.total_messages_sent || 0}</p>
                <p className="text-green-600 text-xs font-bold">Messages</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          {user?.id !== userId && (
            <div className="flex space-x-3">
              <Button
                onClick={sendFriendRequest}
                disabled={friendStatus !== 'none'}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black rounded-2xl"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {friendStatus === 'none' ? 'Add Friend' : 
                 friendStatus === 'pending' ? 'Request Sent' : 'Friends'}
              </Button>
              
              <Button
                onClick={handleTradeRequest}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black rounded-2xl"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Trade
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
