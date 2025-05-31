
import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const checkIfBanned = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_banned, ban_reason')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error checking ban status:', error)
        return false
      }

      if (data?.is_banned) {
        await supabase.auth.signOut()
        toast({
          title: "Account Banned",
          description: `Banned: ${data.ban_reason || 'No reason provided'}`,
          variant: 'destructive'
        })
        return true
      }

      return false
    } catch (error) {
      console.error('Ban check error:', error)
      return false
    }
  }

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Check ban status when user signs in
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            checkIfBanned(session.user.id)
          }, 0)
        }
      }
    )

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Check ban status for existing session
      if (session?.user) {
        setTimeout(() => {
          checkIfBanned(session.user.id)
        }, 0)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
