
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        toast({
          title: "Welcome back! 🎉",
          description: "Successfully logged in to Oranget!",
        })
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0]
            }
          }
        })
        if (error) throw error
        
        toast({
          title: "Welcome to Oranget! 🧡",
          description: "Your account has been created successfully!",
        })
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      toast({
        title: "Oops! Something went wrong",
        description: error.message || 'An error occurred during authentication',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center p-4 font-fredoka relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-3xl px-8 py-4 border-4 border-white/30 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-300 to-orange-500 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg relative transform hover:rotate-12 transition-transform duration-500">
              {/* Animated Blook Face */}
              <div className="w-4 h-4 bg-white rounded-full absolute top-2 left-2 animate-pulse"></div>
              <div className="w-4 h-4 bg-white rounded-full absolute top-2 right-2 animate-pulse"></div>
              <div className="w-1 h-1 bg-orange-800 rounded-full absolute top-3 left-3"></div>
              <div className="w-1 h-1 bg-orange-800 rounded-full absolute top-3 right-3"></div>
              <div className="w-5 h-2 bg-orange-800 rounded-full absolute bottom-2 opacity-80"></div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-2xl tracking-wider">Oranget</h1>
              <p className="text-white/90 font-bold text-lg">Your Gaming World</p>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-4 border-orange-200 rounded-3xl shadow-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center border-b-4 border-orange-300">
            <CardTitle className="text-3xl font-black flex items-center justify-center space-x-2">
              <Sparkles className="w-8 h-8" />
              <span>{isLogin ? 'Welcome Back!' : 'Join Oranget!'}</span>
            </CardTitle>
            <p className="text-orange-100 font-bold text-lg">
              {isLogin ? 'Ready to continue your adventure?' : 'Start your gaming journey today!'}
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-6 w-6 text-orange-500" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12 h-14 text-lg font-bold border-4 border-orange-200 rounded-2xl focus:border-orange-400 bg-orange-50/50"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-6 w-6 text-orange-500" />
                </div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 text-lg font-bold border-4 border-orange-200 rounded-2xl focus:border-orange-400 bg-orange-50/50"
                  required
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-orange-500" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 text-lg font-bold border-4 border-orange-200 rounded-2xl focus:border-orange-400 bg-orange-50/50"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6 text-orange-500 hover:text-orange-600" />
                  ) : (
                    <Eye className="h-6 w-6 text-orange-500 hover:text-orange-600" />
                  )}
                </button>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 text-xl font-black bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl border-4 border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isLogin ? 'Logging In...' : 'Creating Account...'}</span>
                  </div>
                ) : (
                  <span>{isLogin ? '🚀 Log In' : '✨ Create Account'}</span>
                )}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-orange-600 font-bold">
                {isLogin ? "Don't have an account yet?" : 'Already have an account?'}
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsLogin(!isLogin)}
                className="mt-2 text-orange-600 hover:text-orange-700 font-black text-lg hover:bg-orange-100 rounded-xl"
              >
                {isLogin ? '🎮 Join Oranget' : '🏠 Back to Login'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fun Footer */}
        <div className="text-center mt-8">
          <p className="text-white/90 font-bold text-lg drop-shadow-lg">
            🧡 Join thousands of players worldwide! 🧡
          </p>
        </div>
      </div>
    </div>
  )
}
