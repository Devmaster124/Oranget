import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { User, Edit3, Save, X, Trophy, MessageSquare, Users } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"

interface Profile {
  id: string
  username: string
  profile_picture: string | null
  blooks_unlocked: number
  total_messages_sent: number
  total_chats_participated: number
  selected_blook_pfp: string | null
  tokens: number
}

interface Blook {
  id: string
  name: string
  image: string
  rarity: string
}

export default function Profile() {
  const { user: authUser } = useAuth()
  const { toast } = useToast()
  const [user, setUser] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingData, setEditingData] = useState({ username: '' })
  const [showBlookSelector, setShowBlookSelector] = useState(false)
  const [userBlooks, setUserBlooks] = useState<Blook[]>([])
  const [selectedBlookForPfp, setSelectedBlookForPfp] = useState<string | null>(null)

  useEffect(() => {
    if (authUser) {
      loadUserProfile()
      loadUserBlooks()
    }
  }, [authUser])

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser?.id)
        .single()

      if (error) {
        console.error('Error loading profile:', error)
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive"
        })
        return
      }

      setUser(data)
      setEditingData({ username: data.username })
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const loadUserBlooks = () => {
    const userBlooks = JSON.parse(localStorage.getItem(`oranget_blooks_${authUser?.id}`) || '[]')
    setUserBlooks(userBlooks)
  }

  const saveProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: editingData.username })
        .eq('id', authUser?.id)

      if (error) {
        console.error('Error updating profile:', error)
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive"
        })
        return
      }

      setUser(prev => ({ ...prev!, username: editingData.username }))
      setIsEditing(false)
      
      toast({
        title: "Profile Updated!",
        description: "Your profile has been updated",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const updateProfilePicture = async () => {
    if (!selectedBlookForPfp) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ selected_blook_pfp: selectedBlookForPfp })
        .eq('id', authUser?.id)

      if (error) {
        console.error('Error updating profile picture:', error)
        toast({
          title: "Error",
          description: "Failed to update profile picture",
          variant: "destructive"
        })
        return
      }

      setUser(prev => ({ ...prev!, selected_blook_pfp: selectedBlookForPfp }))
      setShowBlookSelector(false)
      
      toast({
        title: "Profile Picture Updated!",
        description: "Your profile picture has been updated",
      })
    } catch (error) {
      console.error('Error updating profile picture:', error)
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        <div className="falling-blooks"></div>
        
        <AppSidebar />
        
        <main className="flex-1 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-orange-600/80 backdrop-blur-sm border-b-4 border-orange-300">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-orange-700 rounded-xl text-white" />
              <div>
                <h1 className="text-4xl text-white font-bold drop-shadow-lg titan-one-light">Profile</h1>
                <p className="text-orange-100 mt-1 font-medium titan-one-light">Manage your account</p>
              </div>
            </div>
            <User className="w-12 h-12 text-white" />
          </div>

          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Profile Card */}
              <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold titan-one-light flex items-center">
                    <User className="w-6 h-6 mr-2" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div 
                      className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-4 border-white/30 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setShowBlookSelector(true)}
                    >
                      <span className="text-4xl" title="Click to change profile picture">
                        {user?.selected_blook_pfp || '🧡'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-bold mb-2 titan-one-light">Username</label>
                      {isEditing ? (
                        <Input
                          value={editingData.username}
                          onChange={(e) => setEditingData(prev => ({ ...prev, username: e.target.value }))}
                          className="bg-orange-400/50 border-orange-200 text-white placeholder:text-orange-100 rounded-2xl titan-one-light"
                        />
                      ) : (
                        <p className="text-xl text-white bg-orange-400/50 rounded-2xl p-3 titan-one-light">
                          {user?.username}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-white font-bold mb-2 titan-one-light">Tokens</label>
                      <p className="text-xl text-white bg-orange-400/50 rounded-2xl p-3 titan-one-light">
                        🪙 {user?.tokens || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4 mt-6">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={saveProfile}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-2xl titan-one-light"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button
                          onClick={() => setIsEditing(false)}
                          variant="outline"
                          className="border-red-300 text-red-200 hover:bg-red-500 font-bold px-6 py-3 rounded-2xl titan-one-light"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-2xl titan-one-light"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                  <CardContent className="p-6 text-center">
                    <Trophy className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2 titan-one-light">Blooks Collected</h3>
                    <p className="text-3xl text-yellow-300 font-bold titan-one-light">{user?.blooks_unlocked || 0}</p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2 titan-one-light">Messages Sent</h3>
                    <p className="text-3xl text-blue-300 font-bold titan-one-light">{user?.total_messages_sent || 0}</p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-green-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2 titan-one-light">Chats Joined</h3>
                    <p className="text-3xl text-green-300 font-bold titan-one-light">{user?.total_chats_participated || 0}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Blook Selector Modal */}
          {showBlookSelector && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-orange-500/95 border-4 border-orange-300 rounded-3xl p-6 m-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto backdrop-blur-sm">
                <h3 className="text-2xl text-white font-bold mb-4 titan-one-light text-center">Choose Your Profile Picture</h3>
                
                {userBlooks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white text-lg titan-one-light">No blooks collected yet!</p>
                    <p className="text-orange-200 titan-one-light">Visit the Market to get some blooks first.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-6">
                    {userBlooks.map((blook) => (
                      <div
                        key={blook.id}
                        className={`cursor-pointer transition-all duration-300 hover:scale-105 p-3 rounded-2xl border-2 ${
                          selectedBlookForPfp === blook.image ? 'border-yellow-400 bg-yellow-400/20' : 'border-orange-300 bg-orange-400/20'
                        }`}
                        onClick={() => setSelectedBlookForPfp(blook.image)}
                      >
                        <div className="text-3xl text-center">{blook.image}</div>
                        <p className="text-xs text-white text-center mt-1 titan-one-light truncate">{blook.name}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setShowBlookSelector(false)}
                    variant="outline"
                    className="border-orange-300 text-orange-100 hover:bg-orange-400 font-bold rounded-2xl titan-one-light"
                  >
                    Cancel
                  </Button>
                  {selectedBlookForPfp && (
                    <Button
                      onClick={updateProfilePicture}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl titan-one-light"
                    >
                      Set as Profile Picture
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  )
}
