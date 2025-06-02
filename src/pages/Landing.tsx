
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"

export default function Landing() {
  const navigate = useNavigate()

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
        <h1 className="text-6xl text-white font-black drop-shadow-lg">
          Oranget
        </h1>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/auth?mode=login')}
            className="text-white text-xl font-bold hover:text-orange-100 transition-colors px-6 py-3 border-2 border-white rounded-xl hover:bg-white/10"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/auth?mode=register')}
            className="text-white text-xl font-bold hover:text-orange-100 transition-colors px-6 py-3 border-2 border-white rounded-xl hover:bg-white/10"
          >
            Register
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[80vh] p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-8xl text-white font-black drop-shadow-lg mb-6">
              Oranget
            </h1>
            <h2 className="text-4xl text-white font-black drop-shadow-lg mb-8">
              Private Server
            </h2>
            <p className="text-2xl text-orange-100 font-bold drop-shadow-md mb-12">
              Oranget is a new Blooket private server with cool features!
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/auth?mode=register')}
                className="w-full lg:w-auto bg-transparent border-4 border-white text-white text-2xl font-black py-6 px-12 rounded-2xl h-auto hover:bg-white hover:text-orange-900 transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Right Side - Floating Blooks */}
          <div className="relative h-96 lg:h-full">
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 animate-pulse">
              {/* Orange Blooks scattered around */}
              <div className="w-16 h-16 bg-orange-500 rounded-lg border-2 border-orange-300 shadow-lg animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-12 h-12 bg-orange-600 rounded-lg border-2 border-orange-400 shadow-lg animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-20 h-20 bg-orange-400 rounded-lg border-2 border-orange-200 shadow-lg animate-bounce" style={{animationDelay: '0.4s'}}></div>
              <div className="w-14 h-14 bg-orange-700 rounded-lg border-2 border-orange-500 shadow-lg animate-bounce" style={{animationDelay: '0.6s'}}></div>
              <div className="w-18 h-18 bg-orange-300 rounded-lg border-2 border-orange-100 shadow-lg animate-bounce" style={{animationDelay: '0.8s'}}></div>
              <div className="w-16 h-16 bg-orange-800 rounded-lg border-2 border-orange-600 shadow-lg animate-bounce" style={{animationDelay: '1s'}}></div>
              <div className="w-10 h-10 bg-orange-500 rounded-lg border-2 border-orange-300 shadow-lg animate-bounce" style={{animationDelay: '1.2s'}}></div>
              <div className="w-22 h-22 bg-orange-400 rounded-lg border-2 border-orange-200 shadow-lg animate-bounce" style={{animationDelay: '1.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
