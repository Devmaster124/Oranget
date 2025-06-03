
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
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('oranget_user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('oranget_user')
      }
    }
    setLoading(false)
  }, [])

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
      localStorage.setItem('oranget_user', JSON.stringify(newUser))
      
      setUser(newUser)
      
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
      localStorage.setItem('oranget_user', JSON.stringify(userData))
      setUser(userData)

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
      setUser(null)
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
