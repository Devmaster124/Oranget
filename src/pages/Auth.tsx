
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, User, Mail, Lock, MessageCircle } from 'lucide-react'

export default function Auth() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: formData.username || formData.email.split('@')[0]
            }
          }
        })

        if (error) throw error

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        })
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) throw error

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        })
        navigate('/')
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

  const handleDiscordLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      })

      if (error) throw error

      toast({
        title: "Redirecting to Discord...",
        description: "You'll be redirected to Discord to complete the login.",
      })
    } catch (error: any) {
      console.error('Discord auth error:', error)
      toast({
        title: "Discord Login Error",
        description: error.message || "Failed to connect with Discord.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/09e55504-38cb-49bf-9019-48c875713ca7.png"
            alt="Logo"
            className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white shadow-2xl"
          />
          <h1 className="text-5xl text-white font-black drop-shadow-lg">Gaming Hub</h1>
          <p className="text-orange-100 text-xl font-bold mt-2">Join the Adventure!</p>
        </div>

        {/* Auth Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-4 border-orange-200 rounded-3xl shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-orange-600 font-black">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <p className="text-orange-500 text-lg">
              {isSignUp ? 'Join thousands of players!' : 'Sign in to continue your journey'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                  <Input
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required={isSignUp}
                    className="pl-12 border-2 border-orange-200 rounded-2xl text-lg py-4 font-bold focus:border-orange-400"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="pl-12 border-2 border-orange-200 rounded-2xl text-lg py-4 font-bold focus:border-orange-400"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="pl-12 pr-12 border-2 border-orange-200 rounded-2xl text-lg py-4 font-bold focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-orange-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xl font-black py-4 rounded-2xl"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            {/* Discord Login */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-orange-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-orange-500 font-bold">or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleDiscordLogin}
              variant="outline"
              className="w-full border-2 border-purple-300 text-purple-600 hover:bg-purple-50 text-xl font-black py-4 rounded-2xl"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Continue with Discord
            </Button>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-orange-600 hover:text-orange-700 font-bold text-lg underline"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-orange-100 text-lg font-bold">
            🎮 Join thousands of players in epic adventures!
          </p>
        </div>
      </div>
    </div>
  )
}
