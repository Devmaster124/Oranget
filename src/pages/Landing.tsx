
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative font-titan overflow-hidden">
      {/* Background with blook pattern */}
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
      <div className="relative z-10 flex justify-end items-center p-6">
        <div className="flex space-x-4">
          <Button 
            onClick={() => navigate('/auth?mode=login')}
            className="bg-orange-600/90 hover:bg-orange-700 text-white font-titan text-xl px-8 py-3 h-auto rounded-xl border-2 border-orange-300"
            style={{ fontWeight: '400' }}
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate('/auth?mode=register')}
            className="bg-orange-600/90 hover:bg-orange-700 text-white font-titan text-xl px-8 py-3 h-auto rounded-xl border-2 border-orange-300"
            style={{ fontWeight: '400' }}
          >
            Register
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-[80vh] p-12">
        <div className="max-w-2xl">
          {/* Logo - moved higher */}
          <h1 className="text-8xl text-white font-titan mb-4 drop-shadow-lg" style={{ fontWeight: '400' }}>
            Oranget
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-4xl text-white font-titan mb-6 drop-shadow-lg" style={{ fontWeight: '400' }}>
            The First Orange Blooket Public Server
          </h2>
          
          {/* Description */}
          <p className="text-xl text-orange-100 font-titan mb-12 max-w-lg leading-relaxed drop-shadow-lg" style={{ fontWeight: '400' }}>
            Join thousands of players in the ultimate Blooket experience with custom games, exclusive content, and endless fun.
          </p>
          
          {/* Action Button */}
          <Button
            onClick={() => navigate('/auth?mode=register')}
            className="w-48 bg-orange-600/90 hover:bg-orange-700 text-white text-xl font-titan py-4 h-auto rounded-xl border-2 border-orange-300"
            style={{ fontWeight: '400' }}
          >
            Get Started
          </Button>
          
          {/* Bottom Text */}
          <div className="mt-16">
            <div className="flex items-center space-x-2 text-orange-200 text-sm font-titan" style={{ fontWeight: '400' }}>
              <span>🔊</span>
              <span>Pronunciation ("Orange-it")</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
