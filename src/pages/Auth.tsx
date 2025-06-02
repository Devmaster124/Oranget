
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from '@/integrations/supabase/client'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { User, Lock } from 'lucide-react'

export default function Auth() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'register')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    username: ''
  })

  useEffect(() => {
    setIsSignUp(searchParams.get('mode') === 'register')
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.username || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        // Create fake email for Supabase
        const fakeEmail = `${formData.username.toLowerCase()}@oranget.local`
        
        const { data, error } = await supabase.auth.signUp({
          email: fakeEmail,
          password: formData.password,
          options: {
            data: {
              username: formData.username
            }
          }
        })

        if (error) {
          if (error.message.includes('already registered') || error.message.includes('duplicate')) {
            toast({
              title: "Username Taken",
              description: "This username is already taken. Please choose another.",
              variant: "destructive"
            })
          } else {
            throw error
          }
          return
        }

        toast({
          title: "Account Created!",
          description: "Welcome to Oranget!",
        })
        navigate('/profile')
      } else {
        // Login with fake email
        const fakeEmail = `${formData.username.toLowerCase()}@oranget.local`
        
        const { error } = await supabase.auth.signInWithPassword({
          email: fakeEmail,
          password: formData.password,
        })

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Login Failed",
              description: "Invalid username or password. Please try again.",
              variant: "destructive"
            })
          } else {
            throw error
          }
          return
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
        navigate('/profile')
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative font-titan overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900">
        <div 
          className="w-full h-full opacity-30"
          style={{
            backgroundImage: 'url("https://i.ibb.co/S4BD0J48/download.png")',
            animation: 'animatedBackground 9s linear infinite'
          }}
        />
      </div>

      {/* Navigation */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <button 
          onClick={() => navigate('/')}
          className="text-6xl text-white font-black drop-shadow-lg hover:text-orange-100 transition-colors"
        >
          Oranget
        </button>
        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-white text-xl font-bold hover:text-orange-100 transition-colors px-6 py-3 border-2 border-white rounded-xl hover:bg-white/10"
        >
          {isSignUp ? 'Login' : 'Register'}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] p-6">
        <div className="w-full max-w-md">
          {/* Auth Form */}
          <form onSubmit={handleAuth} className="bg-orange-800/90 backdrop-blur-sm border-4 border-orange-300 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl text-white font-black text-center mb-8 drop-shadow-lg">
              {isSignUp ? 'Register' : 'Login'}
            </h1>

            <div className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-300 w-6 h-6" />
                <Input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="pl-12 border-2 border-orange-400 rounded-2xl text-lg py-4 font-bold focus:border-orange-200 bg-orange-700/50 text-white placeholder:text-orange-200"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-300 w-6 h-6" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="pl-12 border-2 border-orange-400 rounded-2xl text-lg py-4 font-bold focus:border-orange-200 bg-orange-700/50 text-white placeholder:text-orange-200"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xl font-black py-4 rounded-2xl h-auto border-2 border-orange-300"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  isSignUp ? 'Register' : 'Login'
                )}
              </Button>
            </div>
          </form>

          <div className="text-center mt-8">
            <p className="text-orange-100 text-lg font-bold drop-shadow-lg">
              Join thousands of players in epic adventures!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
