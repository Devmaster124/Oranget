
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Shield, Ban, UserCheck, Crown } from 'lucide-react'

interface UserProfile {
  id: string
  username: string
  tokens: number
  orange_drips: number
  is_banned?: boolean
  ban_reason?: string | null
}

export default function AdminPanel() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [banReason, setBanReason] = useState('')
  const [userRole, setUserRole] = useState<string>('')

  useEffect(() => {
    if (user) {
      fetchUserRole()
      fetchUsers()
    }
  }, [user])

  const fetchUserRole = async () => {
    try {
      // Check if user is admin based on username
      setUserRole(user?.username?.includes('admin') ? 'admin' : 'user')
    } catch (error) {
      console.error('Error fetching user role:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      // Load users from localStorage
      const storedUsers = JSON.parse(localStorage.getItem('oranget_users') || '{}')
      const usersList = Object.entries(storedUsers).map(([username, data]: [string, any]) => ({
        id: data.userData.id,
        username: data.userData.username,
        tokens: data.userData.tokens,
        orange_drips: 0
      }))
      setUsers(usersList)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const banUser = async () => {
    if (!selectedUser || !banReason) return

    try {
      const storedUsers = JSON.parse(localStorage.getItem('oranget_users') || '{}')
      const selectedUserData = users.find(u => u.id === selectedUser)
      
      if (selectedUserData) {
        const originalUsername = selectedUserData.username
        const bannedUsername = `BANNED_${banReason}`
        
        // Update the user data
        if (storedUsers[originalUsername]) {
          storedUsers[originalUsername].userData.username = bannedUsername
          localStorage.setItem('oranget_users', JSON.stringify(storedUsers))
        }
      }

      toast({
        title: "User banned!",
        description: "User has been banned from the platform",
      })

      fetchUsers()
      setSelectedUser('')
      setBanReason('')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const unbanUser = async () => {
    if (!selectedUser) return

    try {
      const storedUsers = JSON.parse(localStorage.getItem('oranget_users') || '{}')
      const selectedUserData = users.find(u => u.id === selectedUser)
      
      if (selectedUserData) {
        const bannedUsername = selectedUserData.username
        const originalUsername = bannedUsername.replace('BANNED_', '').split('_')[0]
        
        // Find and update the user data
        Object.keys(storedUsers).forEach(username => {
          if (storedUsers[username].userData.username === bannedUsername) {
            storedUsers[username].userData.username = originalUsername || 'Player'
            localStorage.setItem('oranget_users', JSON.stringify(storedUsers))
          }
        })
      }

      toast({
        title: "User unbanned!",
        description: "User has been unbanned",
      })

      fetchUsers()
      setSelectedUser('')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  if (userRole !== 'admin' && !user?.username?.includes('admin')) {
    return null
  }

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-4 border-red-200 rounded-3xl shadow-2xl">
        <CardContent className="p-6 text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-600 font-bold">Loading admin panel...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-4 border-red-200 rounded-3xl shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white border-b-4 border-red-300">
        <CardTitle className="text-2xl font-black flex items-center">
          <Shield className="w-8 h-8 mr-3" />
          Titan Admin Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* User Selection */}
        <div>
          <label className="block text-red-700 font-bold mb-2">Select User</label>
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="border-4 border-red-200 rounded-2xl">
              <SelectValue placeholder="Choose a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.username} {user.username.includes('BANNED_') ? '(BANNED)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ban Section */}
        <div className="border-2 border-red-200 rounded-2xl p-4">
          <h3 className="text-red-700 font-black mb-3 flex items-center">
            <Ban className="w-5 h-5 mr-2" />
            Ban Management
          </h3>
          <div className="space-y-3">
            <Input
              placeholder="Ban reason"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="border-2 border-red-200"
            />
            <div className="flex gap-2">
              <Button
                onClick={banUser}
                disabled={!selectedUser || !banReason}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl"
              >
                Ban User
              </Button>
              <Button
                onClick={unbanUser}
                disabled={!selectedUser}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl"
              >
                Unban User
              </Button>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="max-h-64 overflow-y-auto space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
              <div>
                <span className="font-bold">{user.username}</span>
                {user.username.includes('BANNED_') && <span className="ml-2 text-red-600 font-bold">(BANNED)</span>}
              </div>
              <div className="text-sm text-gray-600">
                {user.tokens} tokens, {user.orange_drips} drips
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
