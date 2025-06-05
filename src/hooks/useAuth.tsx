
import { createContext, useContext, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  username: string
  tokens: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Auto-login check
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('oranget_user')
        const storedSession = localStorage.getItem('oranget_session')
        const autoLogin = localStorage.getItem('oranget_auto_login')
        
        if (storedUser && storedSession && autoLogin === 'true') {
          const userData = JSON.parse(storedUser)
          const sessionData = JSON.parse(storedSession)
          
          // Check if session is still valid (7 days for auto-login)
          const sessionAge = Date.now() - sessionData.timestamp
          const sessionValid = sessionAge < 7 * 24 * 60 * 60 * 1000 // 7 days
          
          if (sessionValid) {
            setUser(userData)
            console.log('Auto-login successful for user:', userData.username)
          } else {
            // Session expired, clear storage
            localStorage.removeItem('oranget_user')
            localStorage.removeItem('oranget_session')
            localStorage.removeItem('oranget_auto_login')
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        localStorage.removeItem('oranget_user')
        localStorage.removeItem('oranget_session')
        localStorage.removeItem('oranget_auto_login')
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const createSession = (userData: User, rememberMe: boolean = true) => {
    const sessionData = {
      timestamp: Date.now(),
      userId: userData.id
    }
    localStorage.setItem('oranget_user', JSON.stringify(userData))
    localStorage.setItem('oranget_session', JSON.stringify(sessionData))
    if (rememberMe) {
      localStorage.setItem('oranget_auto_login', 'true')
    }
    setUser(userData)
  }

  const signUp = async (username: string, password: string) => {
    try {
      // Check if username already exists
      const existingUsers = JSON.parse(localStorage.getItem('oranget_users') || '{}')
      
      if (existingUsers[username]) {
        return { success: false, error: 'Username already exists' }
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        tokens: 1000
      }

      // Store user credentials and data
      existingUsers[username] = { password, userData: newUser }
      localStorage.setItem('oranget_users', JSON.stringify(existingUsers))
      
      createSession(newUser, true)
      
      toast({
        title: "Account Created!",
        description: "Welcome to Oranget!",
      })

      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Failed to create account' }
    }
  }

  const signIn = async (username: string, password: string) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('oranget_users') || '{}')
      
      if (!existingUsers[username] || existingUsers[username].password !== password) {
        return { success: false, error: 'Invalid username or password' }
      }

      const userData = existingUsers[username].userData
      createSession(userData, true)

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Failed to sign in' }
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('oranget_user')
      localStorage.removeItem('oranget_session')
      localStorage.removeItem('oranget_auto_login')
      setUser(null)
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    loading,
    signOut,
    signIn,
    signUp
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
