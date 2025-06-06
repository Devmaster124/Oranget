
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Camera, Trophy, MessageCircle, Heart, Coins } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"

interface Blook {
  id: string
  name: string
  image: string
  rarity: string
}

export default function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [userBlooks, setUserBlooks] = useState<Blook[]>([])
  const [showBlookSelector, setShowBlookSelector] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProfile()
      loadUserBlooks()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
        return
      }

      if (data) {
        setProfile(data)
      } else {
        // Create default profile
        const defaultProfile = {
          id: user?.id,
          username: user?.username,
          tokens: 1000,
          orange_drips: 0,
          blooks_unlocked: 0,
          total_chats_participated: 0,
          total_messages_sent: 0,
          selected_blook_pfp: '🧡'
        }
        setProfile(defaultProfile)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading profile:', error)
      setLoading(false)
    }
  }

  const loadUserBlooks = () => {
    const savedBlooks = JSON.parse(localStorage.getItem(`oranget_blooks_${user?.id}`) || '[]')
    setUserBlooks(savedBlooks)
  }

  const updateBlookPfp = async (blook: Blook) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ selected_blook_pfp: blook.image })
        .eq('id', user?.id)

      if (error) {
        console.error('Error updating profile:', error)
        toast({
          title: "Error",
          description: "Failed to update profile picture.",
          variant: "destructive"
        })
        return
      }

      const updatedProfile = { ...profile, selected_blook_pfp: blook.image }
      setProfile(updatedProfile)
      setShowBlookSelector(false)
      
      toast({
        title: "Profile updated!",
        description: `${blook.name} is now your profile picture`,
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile picture.",
        variant: "destructive"
      })
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'uncommon': return 'from-green-400 to-green-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-yellow-400 to-yellow-600'
      case 'chroma': return 'from-pink-400 via-purple-400 to-blue-400'
      default: return 'from-orange-400 to-orange-600'
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full blook-background">
          <AppSidebar />
          <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-xl font-medium titan-one-light">Loading profile...</p>
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full blook-background">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="blacket-button p-2" />
                <div>
                  <h1 className="text-3xl md:text-4xl text-white font-bold drop-shadow-lg titan-one-light">
                    Profile
                  </h1>
                  <p className="text-orange-100 mt-1 font-medium text-sm md:text-base titan-one-light">Master your gaming empire!</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Profile Info Card */}
              <Card className="blacket-card hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32 border-6 border-white/30 shadow-2xl">
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-4xl md:text-6xl font-bold titan-one-light">
                        {profile?.selected_blook_pfp || '🧡'}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:bg-orange-600 transition-colors cursor-pointer"
                      onClick={() => setShowBlookSelector(true)}
                    >
                      <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl text-white font-bold titan-one-light">{profile?.username}</CardTitle>
                  <p className="text-orange-200 font-medium text-sm md:text-base titan-one-light">Username: {user?.username}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 md:p-4 bg-white/10 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                      <Coins className="w-6 h-6 md:w-8 md:h-8 text-orange-300 mx-auto mb-2" />
                      <p className="text-xl md:text-2xl font-bold text-white titan-one-light">{profile?.tokens || 0}</p>
                      <p className="text-orange-200 text-xs md:text-sm font-medium titan-one-light">Tokens</p>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-white/10 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                      <div className="text-xl md:text-2xl mb-2">🧡</div>
                      <p className="text-xl md:text-2xl font-bold text-white titan-one-light">{profile?.orange_drips || 0}</p>
                      <p className="text-orange-200 text-xs md:text-sm font-medium titan-one-light">Orange Drips</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="blacket-card hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold titan-one-light flex items-center">
                    <Trophy className="w-8 h-8 mr-3" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                    <div className="flex items-center">
                      <Heart className="w-8 h-8 text-purple-300 mr-3" />
                      <div>
                        <p className="font-bold text-white titan-one-light">Blooks Unlocked</p>
                        <p className="text-orange-200 text-sm titan-one-light">Collect them all!</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-white titan-one-light">{userBlooks.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                    <div className="flex items-center">
                      <MessageCircle className="w-8 h-8 text-blue-300 mr-3" />
                      <div>
                        <p className="font-bold text-white titan-one-light">Chats Joined</p>
                        <p className="text-orange-200 text-sm titan-one-light">Social butterfly!</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-white titan-one-light">{profile?.total_chats_participated || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                    <div className="flex items-center">
                      <MessageCircle className="w-8 h-8 text-green-300 mr-3" />
                      <div>
                        <p className="font-bold text-white titan-one-light">Messages Sent</p>
                        <p className="text-orange-200 text-sm titan-one-light">Keep chatting!</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-white titan-one-light">{profile?.total_messages_sent || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Blook Collection Preview */}
            <Card className="mt-6 md:mt-8 blacket-card">
              <CardHeader>
                <CardTitle className="text-2xl text-white font-bold titan-one-light flex items-center">
                  <Heart className="w-8 h-8 mr-3" />
                  Your Blook Collection ({userBlooks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userBlooks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-orange-200 titan-one-light">No blooks yet! Visit the Market to open some packs.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {userBlooks.slice(0, 16).map((blook, index) => (
                      <div
                        key={index}
                        className={`w-16 h-16 bg-gradient-to-br ${getRarityColor(blook.rarity)} rounded-xl flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform border-2 border-white/30`}
                        title={`${blook.name} (${blook.rarity})`}
                      >
                        {blook.image}
                      </div>
                    ))}
                    {userBlooks.length > 16 && (
                      <div className="w-16 h-16 bg-orange-500/50 rounded-xl flex items-center justify-center text-white font-bold titan-one-light border-2 border-white/30">
                        +{userBlooks.length - 16}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Blook Selector Modal */}
          {showBlookSelector && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="blacket-card max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold titan-one-light">Choose Your Profile Blook</CardTitle>
                </CardHeader>
                <CardContent>
                  {userBlooks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-orange-200 titan-one-light">No blooks available! Open some packs first.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                      {userBlooks.map((blook, index) => (
                        <div
                          key={index}
                          className={`w-20 h-20 bg-gradient-to-br ${getRarityColor(blook.rarity)} rounded-xl flex items-center justify-center text-3xl cursor-pointer hover:scale-110 transition-transform border-2 border-white/30 ${
                            profile?.selected_blook_pfp === blook.image ? 'ring-4 ring-yellow-400' : ''
                          }`}
                          onClick={() => updateBlookPfp(blook)}
                          title={`${blook.name} (${blook.rarity})`}
                        >
                          {blook.image}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-6 text-center">
                    <Button
                      onClick={() => setShowBlookSelector(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-6 py-2 titan-one-light"
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  )
}
