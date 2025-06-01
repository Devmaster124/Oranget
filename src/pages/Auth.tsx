
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Mail, Lock, User, ArrowRight, MessageCircle } from 'lucide-react'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || (!isLogin && !username)) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        toast({
          title: "Welcome back!",
          description: "Successfully signed in",
        })
        
        navigate('/profile')
      } else {
        const redirectUrl = `${window.location.origin}/`
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username: username
            }
          }
        })

        if (error) throw error

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account",
        })
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      toast({
        title: "Authentication failed",
        description: error.message || "Please try again",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDiscordAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/profile`
        }
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Discord auth error:', error)
      toast({
        title: "Discord authentication failed",
        description: error.message || "Please try again",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-orange-300/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mb-6 border-6 border-white shadow-2xl transform hover:rotate-6 transition-transform duration-500">
            <span className="text-white font-black text-4xl drop-shadow-lg">🧡</span>
          </div>
          <h1 className="text-5xl font-black text-orange-600 mb-2 drop-shadow-lg">Oranget</h1>
          <p className="text-xl text-orange-500 font-bold">Join the Gaming Revolution!</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-lg border-4 border-orange-200 rounded-3xl shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-b-4 border-orange-300">
            <CardTitle className="text-center text-2xl font-black">
              {isLogin ? 'Welcome Back!' : 'Join Oranget!'}
            </CardTitle>
            <p className="text-center text-orange-100 font-bold">
              {isLogin ? 'Sign in to continue your adventure' : 'Create your gaming account'}
            </p>
          </CardHeader>
          
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-orange-700 font-bold flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 border-3 border-orange-200 rounded-xl focus:border-orange-400 text-lg font-bold"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-orange-700 font-bold flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 border-3 border-orange-200 rounded-xl focus:border-orange-400 text-lg font-bold"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-orange-700 font-bold flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-3 border-orange-200 rounded-xl focus:border-orange-400 text-lg font-bold"
                  required
                  minLength={6}
                />
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-lg rounded-xl border-3 border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Please wait...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Discord OAuth */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-orange-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-orange-600 font-bold">or</span>
              </div>
            </div>

            <Button
              onClick={handleDiscordAuth}
              className="w-full h-12 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-lg rounded-xl border-3 border-[#4752C4] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Continue with Discord
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up!" 
                  : "Already have an account? Sign in!"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-orange-500 font-bold text-lg">
            🎮 Join thousands of players worldwide! 🌟
          </p>
        </div>
      </div>
    </div>
  )
}
