
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { LogOut, Users, Store, Trophy, MessageCircle, Play, Heart } from 'lucide-react'

export default function Index() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 font-fredoka relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 bg-orange-300/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg transform hover:rotate-12 transition-transform duration-500">
            <span className="text-white font-black text-3xl drop-shadow-lg">O</span>
          </div>
          <div>
            <h1 className="text-5xl font-black text-orange-600 drop-shadow-lg tracking-wide">Oranget</h1>
            <p className="text-orange-500 font-bold text-xl">Your Gaming Universe!</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 border-4 border-orange-200 shadow-lg">
              <span className="text-orange-600 font-black text-lg">Welcome back, {user.email?.split('@')[0]}! 🎮</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-4 border-orange-300 text-orange-600 hover:bg-orange-50 font-black text-lg rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <div className="mx-auto w-40 h-40 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mb-8 border-8 border-white shadow-2xl transform hover:rotate-6 transition-transform duration-500">
            <span className="text-white font-black text-8xl drop-shadow-2xl">🧡</span>
          </div>
          <h2 className="text-6xl font-black text-orange-600 mb-6 drop-shadow-lg tracking-wide">
            Welcome to Oranget!
          </h2>
          <p className="text-2xl text-orange-500 max-w-3xl mx-auto font-bold leading-relaxed">
            The ultimate gaming platform where you can play amazing games, chat with friends worldwide, 
            collect awesome blooks, and have endless fun! 🎮✨
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-br from-green-100 to-green-200 border-b-4 border-green-300">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-4 border-4 border-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Play className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-orange-600 text-2xl font-black">Mini Games</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-orange-500 text-center font-bold text-lg mb-4">
                Play exciting singleplayer and multiplayer games! Challenge friends and earn rewards!
              </p>
              <Button
                onClick={() => navigate('/games')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-black text-lg py-3 border-4 border-green-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                🎮 Play Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-br from-purple-100 to-purple-200 border-b-4 border-purple-300">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4 border-4 border-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-orange-600 text-2xl font-black">Collect Blooks</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-orange-500 text-center font-bold text-lg mb-4">
                Open packs, collect amazing blooks, and show off your collection to friends!
              </p>
              <Button
                onClick={() => navigate('/blooks')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl font-black text-lg py-3 border-4 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                💖 View Collection
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-br from-blue-100 to-blue-200 border-b-4 border-blue-300">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-4 border-4 border-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-orange-600 text-2xl font-black">Community</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-orange-500 text-center font-bold text-lg mb-4">
                Chat with players from around the world! Make new friends and share your adventures!
              </p>
              <Button
                onClick={() => navigate('/community')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-black text-lg py-3 border-4 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                💬 Join Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-br from-yellow-100 to-yellow-200 border-b-4 border-yellow-300">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-4 border-4 border-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Store className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-orange-600 text-2xl font-black">Marketplace</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-orange-500 text-center font-bold text-lg mb-4">
                Open exciting packs with tokens! Discover rare blooks and build your collection!
              </p>
              <Button
                onClick={() => navigate('/marketplace')}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-2xl font-black text-lg py-3 border-4 border-yellow-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                🛒 Open Packs
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-br from-red-100 to-red-200 border-b-4 border-red-300">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mb-4 border-4 border-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-orange-600 text-2xl font-black">Leaderboards</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-orange-500 text-center font-bold text-lg mb-4">
                Compete for the top spot! Show off your gaming skills and climb the rankings!
              </p>
              <Button
                disabled
                className="w-full bg-gray-400 text-white rounded-2xl font-black text-lg py-3 border-4 border-gray-300 cursor-not-allowed opacity-60"
              >
                🚧 Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform group overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-br from-pink-100 to-pink-200 border-b-4 border-pink-300">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mb-4 border-4 border-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-orange-600 text-2xl font-black">Social Features</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-orange-500 text-center font-bold text-lg mb-4">
                Make friends, share achievements, and build your social gaming network!
              </p>
              <Button
                disabled
                className="w-full bg-gray-400 text-white rounded-2xl font-black text-lg py-3 border-4 border-gray-300 cursor-not-allowed opacity-60"
              >
                🚧 Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 border-8 border-orange-300 rounded-3xl max-w-4xl mx-auto shadow-2xl overflow-hidden">
            <CardContent className="p-12">
              <h3 className="text-4xl font-black text-white mb-6 drop-shadow-lg">Ready to Start Your Adventure? 🚀</h3>
              <p className="text-orange-100 text-xl mb-8 font-bold leading-relaxed">
                Join thousands of players in the most exciting gaming platform! 
                Play games, collect blooks, chat with friends, and have endless fun!
              </p>
              <Button
                onClick={() => navigate('/games')}
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 px-12 py-4 text-2xl font-black rounded-2xl shadow-lg border-4 border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:scale-110"
              >
                🎮 Start Playing Now!
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
