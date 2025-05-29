
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { LogOut, Users, Store, Trophy, MessageCircle, Play } from 'lucide-react'

export default function Index() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 font-fredoka">
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

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-orange-600">Oranget</h1>
        
        {user && (
          <div className="flex items-center space-x-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 border-2 border-orange-200">
              <span className="text-orange-600 font-bold">Welcome, {user.email}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-xl">
            <span className="text-white font-bold text-6xl">O</span>
          </div>
          <h2 className="text-5xl font-bold text-orange-600 mb-4">Welcome to Oranget!</h2>
          <p className="text-xl text-orange-500 max-w-2xl mx-auto">
            The ultimate gaming platform where you can play, chat, trade, and compete with players worldwide!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 border-2 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-orange-600">Play Games</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-500 text-center">
                Enjoy exciting games and earn tokens as you play!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 border-2 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-orange-600">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-500 text-center">
                Chat with players from around the world in real-time!
              </p>
              <Button
                onClick={() => navigate('/community')}
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
              >
                Join Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 border-2 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-orange-600">Marketplace</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-500 text-center">
                Buy and sell items, open packs, and trade with others!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 border-2 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-orange-600">Leaderboards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-500 text-center">
                Compete for the top spot and show off your skills!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 border-2 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-orange-600">Social Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-500 text-center">
                Make friends, join groups, and share your achievements!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 border-2 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">🎰</span>
              </div>
              <CardTitle className="text-orange-600">Casino</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-500 text-center">
                Try your luck with various casino games and win big!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-orange-400 to-orange-600 border-0 rounded-3xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Playing?</h3>
              <p className="text-orange-100 text-lg mb-6">
                Join thousands of players in the most exciting gaming platform!
              </p>
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg font-bold rounded-xl shadow-lg"
              >
                Start Your Adventure
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
