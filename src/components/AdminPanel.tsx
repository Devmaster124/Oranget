
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Shield, Ban, UserCheck, Crown } from 'lucide-react'

interface UserProfile {
  id: string
  username: string
  role: string
  is_banned: boolean
  ban_reason: string | null
  tokens: number
  orange_drips: number
}

export default function AdminPanel() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [newRole, setNewRole] = useState<string>('')
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
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single()

      if (error) throw error
      setUserRole(data?.role || 'user')
    } catch (error) {
      console.error('Error fetching user role:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, role, is_banned, ban_reason, tokens, orange_drips')
        .order('username')

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const promoteUser = async () => {
    if (!selectedUser || !newRole) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', selectedUser)

      if (error) throw error

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user?.id,
          target_user_id: selectedUser,
          action_type: 'promote',
          new_value: newRole
        })

      toast({
        title: "User promoted!",
        description: `User has been promoted to ${newRole}`,
      })

      fetchUsers()
      setSelectedUser('')
      setNewRole('')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const banUser = async () => {
    if (!selectedUser || !banReason) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_banned: true, 
          ban_reason: banReason,
          banned_at: new Date().toISOString(),
          banned_by: user?.id
        })
        .eq('id', selectedUser)

      if (error) throw error

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user?.id,
          target_user_id: selectedUser,
          action_type: 'ban',
          reason: banReason
        })

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
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_banned: false, 
          ban_reason: null,
          banned_at: null,
          banned_by: null
        })
        .eq('id', selectedUser)

      if (error) throw error

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_id: user?.id,
          target_user_id: selectedUser,
          action_type: 'unban'
        })

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

  if (userRole !== 'admin' && userRole !== 'owner') {
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
          Admin Panel
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
                  {user.username} ({user.role}) {user.is_banned ? '(BANNED)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Promotion Section */}
        <div className="border-2 border-orange-200 rounded-2xl p-4">
          <h3 className="text-orange-700 font-black mb-3 flex items-center">
            <Crown className="w-5 h-5 mr-2" />
            Promote User
          </h3>
          <div className="space-y-3">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="border-2 border-orange-200">
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                {userRole === 'owner' && <SelectItem value="admin">Admin</SelectItem>}
              </SelectContent>
            </Select>
            <Button
              onClick={promoteUser}
              disabled={!selectedUser || !newRole}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Promote User
            </Button>
          </div>
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
                <span className="ml-2 text-sm text-gray-600">({user.role})</span>
                {user.is_banned && <span className="ml-2 text-red-600 font-bold">(BANNED)</span>}
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
