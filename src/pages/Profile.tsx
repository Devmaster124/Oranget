
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Camera, Trophy, MessageCircle, Heart, Coins } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

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
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()
      
      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfilePicture = async (imageUrl: string) => {
    setUploading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ profile_picture: imageUrl })
        .eq('id', user?.id)
      
      if (error) throw error
      
      setProfile({ ...profile, profile_picture: imageUrl })
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
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 font-fredoka">
          <AppSidebar />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-orange-600 text-xl font-bold">Loading your profile...</p>
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 font-fredoka">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-100 rounded-xl" />
                <div>
                  <h1 className="text-4xl font-fredoka text-orange-600 font-black drop-shadow-lg">
                    🎭 Your Profile
                  </h1>
                  <p className="text-orange-500 mt-1 font-bold">Customize your Oranget experience!</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile Info Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-32 h-32 border-6 border-orange-300 shadow-2xl">
                      <AvatarImage src={profile?.profile_picture} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-4xl font-black">
                        {profile?.username?.[0]?.toUpperCase() || 'O'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg hover:bg-orange-600 transition-colors cursor-pointer">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-orange-600 font-black">{profile?.username}</CardTitle>
                  <p className="text-orange-500 font-bold">{user?.email}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl border-2 border-orange-300">
                      <Coins className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-black text-orange-700">{profile?.tokens || 0}</p>
                      <p className="text-orange-600 text-sm font-bold">Tokens</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-2xl border-2 border-orange-300">
                      <div className="text-2xl mb-2">🧡</div>
                      <p className="text-2xl font-black text-orange-700">{profile?.orange_drips || 0}</p>
                      <p className="text-orange-600 text-sm font-bold">Orange Drips</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <CardTitle className="text-2xl text-orange-600 font-black flex items-center">
                    <Trophy className="w-8 h-8 mr-3" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200">
                    <div className="flex items-center">
                      <Heart className="w-8 h-8 text-purple-600 mr-3" />
                      <div>
                        <p className="font-black text-purple-700">Blooks Unlocked</p>
                        <p className="text-purple-600 text-sm">Collect them all!</p>
                      </div>
                    </div>
                    <span className="text-3xl font-black text-purple-700">{profile?.blooks_unlocked || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl border-2 border-blue-200">
                    <div className="flex items-center">
                      <MessageCircle className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <p className="font-black text-blue-700">Chats Joined</p>
                        <p className="text-blue-600 text-sm">Social butterfly!</p>
                      </div>
                    </div>
                    <span className="text-3xl font-black text-blue-700">{profile?.total_chats_participated || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-200">
                    <div className="flex items-center">
                      <MessageCircle className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <p className="font-black text-green-700">Messages Sent</p>
                        <p className="text-green-600 text-sm">Keep chatting!</p>
                      </div>
                    </div>
                    <span className="text-3xl font-black text-green-700">{profile?.total_messages_sent || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Picture Selection */}
            <Card className="mt-8 bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-600 font-black flex items-center">
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
                        className="w-20 h-20 rounded-2xl border-4 border-orange-200 hover:border-orange-400 transition-all duration-300 group-hover:scale-110 shadow-lg"
                      />
                      {profile?.profile_picture === pic && (
                        <div className="absolute inset-0 bg-orange-500/30 rounded-2xl border-4 border-orange-500"></div>
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
