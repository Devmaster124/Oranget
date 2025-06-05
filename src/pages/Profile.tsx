
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Camera, Trophy, MessageCircle, Heart, Coins } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const profilePictures = [
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=200',
    'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200',
    'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=200',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200',
    'https://images.unsplash.com/photo-1569780516031-03b9cfbcee08?w=200'
  ]

  useEffect(() => {
    if (user) {
      const storedProfile = localStorage.getItem(`oranget_profile_${user.id}`)
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile))
      } else {
        const defaultProfile = {
          id: user.id,
          username: user.username,
          tokens: user.tokens,
          profile_picture: profilePictures[0],
          role: 'player',
          orange_drips: 0,
          blooks_unlocked: 0,
          total_chats_participated: 0,
          total_messages_sent: 0
        }
        setProfile(defaultProfile)
        localStorage.setItem(`oranget_profile_${user.id}`, JSON.stringify(defaultProfile))
      }
      setLoading(false)
    }
  }, [user])

  const updateProfilePicture = async (imageUrl: string) => {
    try {
      const updatedProfile = { ...profile, profile_picture: imageUrl }
      setProfile(updatedProfile)
      localStorage.setItem(`oranget_profile_${user?.id}`, JSON.stringify(updatedProfile))
      
      toast({
        title: "Profile updated!",
        description: "Your profile picture has been changed.",
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

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full blook-background">
          <AppSidebar />
          <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-xl font-medium titan-light">Loading profile...</p>
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
                  <h1 className="text-3xl md:text-4xl text-white font-bold drop-shadow-lg titan-light">
                    Profile
                  </h1>
                  <p className="text-orange-100 mt-1 font-medium text-sm md:text-base titan-light">Master your gaming empire!</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Profile Info Card */}
              <Card className="blacket-card hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32 border-6 border-white/30 shadow-2xl">
                      <AvatarImage src={profile?.profile_picture} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl md:text-4xl font-bold titan-light">
                        {profile?.username?.[0]?.toUpperCase() || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:bg-orange-600 transition-colors cursor-pointer">
                      <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl text-white font-bold titan-light">{profile?.username}</CardTitle>
                  <p className="text-orange-200 font-medium text-sm md:text-base titan-light">Username: {user?.username}</p>
                  {profile?.role && (
                    <div className="mt-2">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold titan-light ${
                        profile.role === 'owner' ? 'bg-purple-500 text-white' :
                        profile.role === 'admin' ? 'bg-red-500 text-white' :
                        profile.role === 'moderator' ? 'bg-blue-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {profile.role.toUpperCase()}
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 md:p-4 bg-white/10 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                      <Coins className="w-6 h-6 md:w-8 md:h-8 text-orange-300 mx-auto mb-2" />
                      <p className="text-xl md:text-2xl font-bold text-white titan-light">{profile?.tokens || 0}</p>
                      <p className="text-orange-200 text-xs md:text-sm font-medium titan-light">Tokens</p>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-white/10 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                      <div className="text-xl md:text-2xl mb-2">🧡</div>
                      <p className="text-xl md:text-2xl font-bold text-white titan-light">{profile?.orange_drips || 0}</p>
                      <p className="text-orange-200 text-xs md:text-sm font-medium titan-light">Orange Drips</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="blacket-card hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold titan-light flex items-center">
                    <Trophy className="w-8 h-8 mr-3" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                    <div className="flex items-center">
                      <Heart className="w-8 h-8 text-purple-300 mr-3" />
                      <div>
                        <p className="font-bold text-white titan-light">Blooks Unlocked</p>
                        <p className="text-orange-200 text-sm titan-light">Collect them all!</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-white titan-light">{profile?.blooks_unlocked || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                    <div className="flex items-center">
                      <MessageCircle className="w-8 h-8 text-blue-300 mr-3" />
                      <div>
                        <p className="font-bold text-white titan-light">Chats Joined</p>
                        <p className="text-orange-200 text-sm titan-light">Social butterfly!</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-white titan-light">{profile?.total_chats_participated || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border-2 border-white/20 backdrop-blur-sm">
                    <div className="flex items-center">
                      <MessageCircle className="w-8 h-8 text-green-300 mr-3" />
                      <div>
                        <p className="font-bold text-white titan-light">Messages Sent</p>
                        <p className="text-orange-200 text-sm titan-light">Keep chatting!</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-white titan-light">{profile?.total_messages_sent || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Picture Selection */}
            <Card className="mt-6 md:mt-8 blacket-card">
              <CardHeader>
                <CardTitle className="text-2xl text-white font-bold titan-light flex items-center">
                  <Camera className="w-8 h-8 mr-3" />
                  Choose Your Avatar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {profilePictures.map((pic, index) => (
                    <div 
                      key={index}
                      className="relative cursor-pointer group"
                      onClick={() => updateProfilePicture(pic)}
                    >
                      <img 
                        src={pic} 
                        alt={`Avatar ${index + 1}`}
                        className="w-20 h-20 rounded-2xl border-4 border-white/30 hover:border-white/60 transition-all duration-300 group-hover:scale-110 shadow-lg"
                      />
                      {profile?.profile_picture === pic && (
                        <div className="absolute inset-0 bg-orange-500/30 rounded-2xl border-4 border-orange-300"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
