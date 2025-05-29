
import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const { toast } = useToast()
  const navigate = useNavigate()

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number"
    }
    return null
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (failedAttempts >= 5) {
      toast({
        title: "Account temporarily locked",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive",
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
        
        if (error) {
          setFailedAttempts(prev => prev + 1)
          throw error
        }
        
        setFailedAttempts(0)
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        })
        navigate('/')
      } else {
        // Validate password for signup
        const passwordError = validatePassword(password)
        if (passwordError) {
          throw new Error(passwordError)
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
            }
          }
        })
        
        if (error) throw error
        
        toast({
          title: "Account created!",
          description: "You have been registered successfully. You can now log in.",
        })
        setIsLogin(true)
        setUsername('')
        setPassword('')
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center font-fredoka">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'url("https://i.ibb.co/d7GK1cC/background.png")',
            animation: 'animatedBackground 9s linear infinite'
          }}
        />
      </div>

      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <a href="/" className="text-3xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
          Oranget
        </a>
        <Button
          variant="outline"
          onClick={() => setIsLogin(!isLogin)}
          className="border-orange-300 text-orange-600 hover:bg-orange-50"
        >
          {isLogin ? 'Need an account?' : 'Already have an account?'}
        </Button>
      </div>

      {/* Auth Form */}
      <Card className="w-full max-w-md mx-4 bg-white/80 backdrop-blur-sm border-orange-200 border-2 rounded-3xl shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <CardTitle className="text-2xl font-bold text-orange-600">
            {isLogin ? 'Welcome Back!' : 'Join Oranget'}
          </CardTitle>
          <p className="text-orange-500 text-sm">
            {isLogin ? 'Sign in to continue your adventure' : 'Create your account to get started'}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 border-orange-200 focus:border-orange-400 rounded-xl"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 border-orange-200 focus:border-orange-400 rounded-xl"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10 border-orange-200 focus:border-orange-400 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {!isLogin && (
              <div className="text-xs text-orange-500 space-y-1">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-orange-400">
                  <li>At least 8 characters</li>
                  <li>One uppercase and one lowercase letter</li>
                  <li>At least one number</li>
                </ul>
              </div>
            )}

            {failedAttempts > 0 && (
              <p className="text-red-500 text-sm text-center">
                Failed attempts: {failedAttempts}/5
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || failedAttempts >= 5}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
