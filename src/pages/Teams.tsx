
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Users, Search, Plus, Crown, Shield, User } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"

interface Guild {
  id: string
  name: string
  description: string
  owner_id: string
  member_count: number
  is_public: boolean
  created_at: string
}

interface GuildMember {
  id: string
  guild_id: string
  user_id: string
  role: string
  joined_at: string
}

export default function Teams() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [userGuild, setUserGuild] = useState<Guild | null>(null)
  const [searchGuild, setSearchGuild] = useState('')
  const [createGuildName, setCreateGuildName] = useState('')
  const [createGuildDesc, setCreateGuildDesc] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadGuilds()
      loadUserGuild()
    }
  }, [user])

  const loadGuilds = async () => {
    try {
      const { data, error } = await supabase
        .from('guilds')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading guilds:', error)
        return
      }

      setGuilds(data || [])
    } catch (error) {
      console.error('Error loading guilds:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserGuild = async () => {
    if (!user) return

    try {
      const { data: memberData, error: memberError } = await supabase
        .from('guild_members')
        .select('guild_id')
        .eq('user_id', user.id)
        .single()

      if (memberError || !memberData) {
        setUserGuild(null)
        return
      }

      const { data: guildData, error: guildError } = await supabase
        .from('guilds')
        .select('*')
        .eq('id', memberData.guild_id)
        .single()

      if (guildError) {
        console.error('Error loading user guild:', guildError)
        return
      }

      setUserGuild(guildData)
    } catch (error) {
      console.error('Error loading user guild:', error)
    }
  }

  const createGuild = async () => {
    if (!createGuildName.trim() || !user) {
      toast({
        title: "Invalid Input",
        description: "Please enter a guild name",
        variant: "destructive"
      })
      return
    }

    try {
      const { data: guildData, error: guildError } = await supabase
        .from('guilds')
        .insert({
          name: createGuildName,
          description: createGuildDesc,
          owner_id: user.id,
        })
        .select()
        .single()

      if (guildError) {
        console.error('Error creating guild:', guildError)
        toast({
          title: "Error",
          description: "Failed to create guild",
          variant: "destructive"
        })
        return
      }

      // Add user as member
      const { error: memberError } = await supabase
        .from('guild_members')
        .insert({
          guild_id: guildData.id,
          user_id: user.id,
          role: 'owner'
        })

      if (memberError) {
        console.error('Error adding guild member:', memberError)
      }

      setUserGuild(guildData)
      setCreateGuildName('')
      setCreateGuildDesc('')
      setShowCreateForm(false)
      loadGuilds()
      
      toast({
        title: "Guild Created!",
        description: `Successfully created guild "${createGuildName}"`,
      })
    } catch (error) {
      console.error('Error creating guild:', error)
    }
  }

  const joinGuild = async (guildId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('guild_members')
        .insert({
          guild_id: guildId,
          user_id: user.id,
          role: 'member'
        })

      if (error) {
        console.error('Error joining guild:', error)
        toast({
          title: "Error",
          description: "Failed to join guild",
          variant: "destructive"
        })
        return
      }

      loadUserGuild()
      loadGuilds()
      
      toast({
        title: "Joined Guild!",
        description: "You have successfully joined the guild",
      })
    } catch (error) {
      console.error('Error joining guild:', error)
    }
  }

  const leaveGuild = async () => {
    if (!user || !userGuild) return

    try {
      const { error } = await supabase
        .from('guild_members')
        .delete()
        .eq('guild_id', userGuild.id)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error leaving guild:', error)
        toast({
          title: "Error",
          description: "Failed to leave guild",
          variant: "destructive"
        })
        return
      }

      setUserGuild(null)
      loadGuilds()
      
      toast({
        title: "Left Guild",
        description: "You have left the guild",
      })
    } catch (error) {
      console.error('Error leaving guild:', error)
    }
  }

  const filteredGuilds = guilds.filter(guild => 
    guild.name.toLowerCase().includes(searchGuild.toLowerCase()) &&
    guild.id !== userGuild?.id
  )

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <div className="falling-blooks"></div>
          <AppSidebar />
          <main className="flex-1 p-6 flex items-center justify-center relative z-10">
            <div className="text-center text-white titan-one-light text-2xl">
              Loading guilds...
            </div>
          </main>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        <div className="falling-blooks"></div>
        
        <AppSidebar />
        
        <main className="flex-1 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-orange-600/80 backdrop-blur-sm border-b-4 border-orange-300">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="blacket-button p-2" />
              <div>
                <h1 className="text-4xl text-white font-bold drop-shadow-lg titan-one-light">Guilds</h1>
                <p className="text-orange-100 mt-1 font-medium titan-one-light">Join or create guilds with other players!</p>
              </div>
            </div>
            <Users className="w-12 h-12 text-white" />
          </div>

          <div className="p-4">
            <div className="max-w-6xl mx-auto space-y-4">
              {/* My Guild Section */}
              {userGuild ? (
                <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white font-bold titan-one-light flex items-center">
                      <Crown className="w-6 h-6 mr-2 text-yellow-300" />
                      My Guild: {userGuild.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-100 mb-4 titan-one-light">{userGuild.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold titan-one-light">Members: {userGuild.member_count}</p>
                      </div>
                      <Button
                        onClick={leaveGuild}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl titan-one-light"
                      >
                        Leave Guild
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                  <CardContent className="p-6 text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 text-white" />
                    <h3 className="text-2xl text-white font-bold mb-2 titan-one-light">You're not in a guild</h3>
                    <p className="text-orange-100 mb-4 titan-one-light">Join an existing guild or create your own!</p>
                    <Button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-xl titan-one-light"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Guild
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Create Guild Form */}
              {showCreateForm && (
                <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white font-bold titan-one-light">Create New Guild</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      value={createGuildName}
                      onChange={(e) => setCreateGuildName(e.target.value)}
                      placeholder="Guild name..."
                      className="bg-orange-400/50 border-orange-200 text-white placeholder:text-orange-100 rounded-2xl titan-one-light"
                    />
                    <Input
                      value={createGuildDesc}
                      onChange={(e) => setCreateGuildDesc(e.target.value)}
                      placeholder="Guild description..."
                      className="bg-orange-400/50 border-orange-200 text-white placeholder:text-orange-100 rounded-2xl titan-one-light"
                    />
                    <div className="flex space-x-3">
                      <Button
                        onClick={createGuild}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl titan-one-light"
                      >
                        Create
                      </Button>
                      <Button
                        onClick={() => setShowCreateForm(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl titan-one-light"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Search Guilds */}
              <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold titan-one-light flex items-center">
                    <Search className="w-6 h-6 mr-2" />
                    Find Guilds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={searchGuild}
                    onChange={(e) => setSearchGuild(e.target.value)}
                    placeholder="Search guilds..."
                    className="bg-orange-400/50 border-orange-200 text-white placeholder:text-orange-100 rounded-2xl titan-one-light"
                  />
                </CardContent>
              </Card>

              {/* Available Guilds */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGuilds.map((guild) => (
                  <Card key={guild.id} className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-white titan-one-light">{guild.name}</h4>
                        <div className="flex items-center text-orange-100">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm titan-one-light">{guild.member_count}</span>
                        </div>
                      </div>
                      <p className="text-orange-100 mb-4 titan-one-light">{guild.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Crown className="w-4 h-4 text-yellow-300" />
                          <span className="text-white text-sm titan-one-light">Guild Owner</span>
                        </div>
                        <Button
                          onClick={() => joinGuild(guild.id)}
                          className="bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-xl titan-one-light"
                        >
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredGuilds.length === 0 && (
                <Card className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                  <CardContent className="p-6 text-center">
                    <p className="text-xl text-orange-100 font-medium titan-one-light">No guilds found!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
