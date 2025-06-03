
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'
import { useToast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)

        // Check if user profile exists and create if needed
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', session.user.id)
              .maybeSingle()

            if (error && error.code !== 'PGRST116') {
              console.error('Error checking user profile:', error)
              return
            }

            // If no profile exists, create one
            if (!profile) {
              const username = session.user.user_metadata?.username || `Player${session.user.id.slice(0, 8)}`
              
              const { error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  username: username,
                  tokens: 1000
                })

              if (createError) {
                console.error('Error creating user profile:', createError)
              }
            }

            // Check if username indicates banned status
            if (profile?.username?.includes('BANNED_')) {
              toast({
                title: "Account Banned",
                description: "Your account has been banned from the platform",
                variant: "destructive"
              })
              await supabase.auth.signOut()
              return
            }
          } catch (error) {
            console.error('Error in auth state change:', error)
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [toast])

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
    } catch (error: any) {
      console.error('Error signing out:', error.message)
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const value = {
    user,
    loading,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
