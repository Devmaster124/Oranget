
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { User, Lock } from 'lucide-react'

export default function Auth() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { signIn, signUp } = useAuth()
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
      let result
      if (isSignUp) {
        result = await signUp(formData.username, formData.password)
      } else {
        result = await signIn(formData.username, formData.password)
      }

      if (result.success) {
        navigate('/dashboard')
      } else {
        toast({
          title: isSignUp ? "Signup Failed" : "Login Failed",
          description: result.error || "Please try again",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast({
        title: "Authentication Error",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative font-titan overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
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
          className="text-6xl text-white font-titan drop-shadow-lg hover:text-orange-100 transition-colors"
          style={{ fontWeight: '400' }}
        >
          Oranget
        </button>
        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-white text-xl font-titan hover:text-orange-100 transition-colors px-6 py-3 border-2 border-white rounded-xl hover:bg-white/10"
          style={{ fontWeight: '400' }}
        >
          {isSignUp ? 'Login' : 'Register'}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] p-6">
        <div className="w-full max-w-md">
          {/* Auth Form */}
          <form onSubmit={handleAuth} className="bg-orange-600/90 backdrop-blur-sm border-4 border-orange-300 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl text-white font-titan text-center mb-8 drop-shadow-lg" style={{ fontWeight: '400' }}>
              {isSignUp ? 'Register' : 'Login'}
            </h1>

            <div className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-200 w-6 h-6" />
                <Input
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="pl-12 border-2 border-orange-300 rounded-2xl text-lg py-4 font-titan focus:border-orange-200 bg-orange-500/50 text-white placeholder:text-orange-200"
                  style={{ fontWeight: '400' }}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-200 w-6 h-6" />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="pl-12 border-2 border-orange-300 rounded-2xl text-lg py-4 font-titan focus:border-orange-200 bg-orange-500/50 text-white placeholder:text-orange-200"
                  style={{ fontWeight: '400' }}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-xl font-titan py-4 rounded-2xl h-auto border-2 border-orange-300 animate-pulse-orange"
                style={{ fontWeight: '400' }}
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
            <p className="text-orange-100 text-lg font-titan drop-shadow-lg" style={{ fontWeight: '400' }}>
              Join thousands of players in epic adventures!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
