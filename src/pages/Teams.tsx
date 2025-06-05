
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { UsersRound, Search, Users, Plus, Crown, Shield, User } from 'lucide-react'

interface Team {
  id: string
  name: string
  description: string
  members: string[]
  leader: string
  isPublic: boolean
  createdAt: number
}

export default function Teams() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [teams, setTeams] = useState<Team[]>([])
  const [userTeam, setUserTeam] = useState<Team | null>(null)
  const [searchTeam, setSearchTeam] = useState('')
  const [createTeamName, setCreateTeamName] = useState('')
  const [createTeamDesc, setCreateTeamDesc] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadTeams()
  }, [user])

  const loadTeams = () => {
    const savedTeams = JSON.parse(localStorage.getItem('oranget_teams') || '[]')
    setTeams(savedTeams)
    
    // Find user's team
    const myTeam = savedTeams.find((team: Team) => team.members.includes(user?.username))
    setUserTeam(myTeam || null)
  }

  const createTeam = () => {
    if (!createTeamName.trim() || !user) {
      toast({
        title: "Invalid Input",
        description: "Please enter a team name",
        variant: "destructive"
      })
      return
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name: createTeamName,
      description: createTeamDesc,
      members: [user.username],
      leader: user.username,
      isPublic: true,
      createdAt: Date.now()
    }

    const savedTeams = JSON.parse(localStorage.getItem('oranget_teams') || '[]')
    savedTeams.push(newTeam)
    localStorage.setItem('oranget_teams', JSON.stringify(savedTeams))
    
    setTeams(savedTeams)
    setUserTeam(newTeam)
    setCreateTeamName('')
    setCreateTeamDesc('')
    setShowCreateForm(false)
    
    toast({
      title: "Team Created!",
      description: `Successfully created team "${createTeamName}"`,
    })
  }

  const joinTeam = (teamId: string) => {
    if (!user) return

    const savedTeams = JSON.parse(localStorage.getItem('oranget_teams') || '[]')
    const updatedTeams = savedTeams.map((team: Team) => {
      if (team.id === teamId && !team.members.includes(user.username)) {
        return { ...team, members: [...team.members, user.username] }
      }
      return team
    })
    
    localStorage.setItem('oranget_teams', JSON.stringify(updatedTeams))
    loadTeams()
    
    toast({
      title: "Joined Team!",
      description: "You have successfully joined the team",
    })
  }

  const leaveTeam = () => {
    if (!user || !userTeam) return

    const savedTeams = JSON.parse(localStorage.getItem('oranget_teams') || '[]')
    const updatedTeams = savedTeams.map((team: Team) => {
      if (team.id === userTeam.id) {
        const newMembers = team.members.filter(member => member !== user.username)
        if (newMembers.length === 0) {
          return null // Delete team if no members left
        }
        return { ...team, members: newMembers, leader: team.leader === user.username ? newMembers[0] : team.leader }
      }
      return team
    }).filter(Boolean)
    
    localStorage.setItem('oranget_teams', JSON.stringify(updatedTeams))
    loadTeams()
    
    toast({
      title: "Left Team",
      description: "You have left the team",
    })
  }

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTeam.toLowerCase()) && 
    !team.members.includes(user?.username || '')
  )

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
                <h1 className="text-4xl text-white font-bold drop-shadow-lg titan-one-light">Teams</h1>
                <p className="text-orange-100 mt-1 font-medium titan-one-light">Join or create teams with other players!</p>
              </div>
            </div>
            <UsersRound className="w-12 h-12 text-white" />
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* My Team Section */}
              {userTeam ? (
                <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white font-bold titan-one-light flex items-center">
                      <Crown className="w-6 h-6 mr-2 text-yellow-300" />
                      My Team: {userTeam.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-100 mb-4 titan-one-light">{userTeam.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold titan-one-light">Members: {userTeam.members.length}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          {userTeam.members.map((member, index) => (
                            <div key={index} className="flex items-center space-x-1 bg-white/20 rounded-lg px-3 py-1">
                              {member === userTeam.leader ? (
                                <Crown className="w-4 h-4 text-yellow-300" />
                              ) : (
                                <User className="w-4 h-4 text-white" />
                              )}
                              <span className="text-white text-sm titan-one-light">{member}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={leaveTeam}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl titan-one-light"
                      >
                        Leave Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                  <CardContent className="p-8 text-center">
                    <UsersRound className="w-16 h-16 mx-auto mb-4 text-white" />
                    <h3 className="text-2xl text-white font-bold mb-2 titan-one-light">You're not in a team</h3>
                    <p className="text-orange-100 mb-4 titan-one-light">Join an existing team or create your own!</p>
                    <Button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-xl titan-one-light"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Team
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Create Team Form */}
              {showCreateForm && (
                <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white font-bold titan-one-light">Create New Team</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      value={createTeamName}
                      onChange={(e) => setCreateTeamName(e.target.value)}
                      placeholder="Team name..."
                      className="bg-orange-400/50 border-orange-200 text-white placeholder:text-orange-100 rounded-2xl titan-one-light"
                    />
                    <Input
                      value={createTeamDesc}
                      onChange={(e) => setCreateTeamDesc(e.target.value)}
                      placeholder="Team description..."
                      className="bg-orange-400/50 border-orange-200 text-white placeholder:text-orange-100 rounded-2xl titan-one-light"
                    />
                    <div className="flex space-x-3">
                      <Button
                        onClick={createTeam}
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

              {/* Search Teams */}
              <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold titan-one-light flex items-center">
                    <Search className="w-6 h-6 mr-2" />
                    Find Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={searchTeam}
                    onChange={(e) => setSearchTeam(e.target.value)}
                    placeholder="Search teams..."
                    className="bg-orange-400/50 border-orange-200 text-white placeholder:text-orange-100 rounded-2xl titan-one-light"
                  />
                </CardContent>
              </Card>

              {/* Available Teams */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeams.map((team) => (
                  <Card key={team.id} className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-white titan-one-light">{team.name}</h4>
                        <div className="flex items-center text-orange-100">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm titan-one-light">{team.members.length}</span>
                        </div>
                      </div>
                      <p className="text-orange-100 mb-4 titan-one-light">{team.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Crown className="w-4 h-4 text-yellow-300" />
                          <span className="text-white text-sm titan-one-light">{team.leader}</span>
                        </div>
                        <Button
                          onClick={() => joinTeam(team.id)}
                          className="bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-xl titan-one-light"
                        >
                          Join
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTeams.length === 0 && (
                <Card className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                  <CardContent className="p-8 text-center">
                    <p className="text-xl text-orange-100 font-medium titan-one-light">No teams found!</p>
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
