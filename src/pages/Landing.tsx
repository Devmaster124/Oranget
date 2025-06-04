import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"

export default function Landing() {
  const navigate = useNavigate()

  const blooks = [
    { name: 'B Blook', color: 'bg-gray-800', position: 'top-20 left-20' },
    { name: 'Pig', color: 'bg-pink-400', position: 'top-32 left-40' },
    { name: 'Pumpkin', color: 'bg-orange-500', position: 'top-16 right-80' },
    { name: 'Cat', color: 'bg-purple-600', position: 'top-40 right-60' },
    { name: 'Camo', color: 'bg-green-600', position: 'top-60 right-40' },
    { name: 'Toast', color: 'bg-yellow-600', position: 'bottom-60 left-32' },
    { name: 'Game', color: 'bg-blue-500', position: 'bottom-40 left-60' },
    { name: 'Among Us', color: 'bg-red-500', position: 'bottom-20 right-80' },
    { name: 'Present', color: 'bg-yellow-400', position: 'bottom-32 right-40' },
    { name: 'Monkey', color: 'bg-yellow-700', position: 'bottom-60 right-20' },
    { name: 'Dragon', color: 'bg-purple-800', position: 'top-80 left-80' },
    { name: 'Shark', color: 'bg-blue-600', position: 'bottom-80 left-20' }
  ]

  return (
    <div className="min-h-screen relative font-titan overflow-hidden bg-gray-800">
      {/* Dark background with blook pattern */}
      <div className="fixed inset-0 bg-gray-800">
        <div 
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23666" fill-opacity="0.4"%3E%3Cpath d="m0 40l40-40h-40v40zm40 0v-40h-40l40 40z"/%3E%3C/g%3E%3C/svg%3E")'
          }}
        />
      </div>

      {/* Floating Blooks */}
      {blooks.map((blook, index) => (
        <div
          key={index}
          className={`absolute w-16 h-16 ${blook.color} rounded-lg border-2 border-gray-600 shadow-lg ${blook.position} animate-float`}
          style={{ animationDelay: `${index * 0.2}s` }}
        />
      ))}

      {/* Navigation */}
      <div className="relative z-10 flex justify-end items-center p-6">
        <div className="flex space-x-4">
          <Button 
            onClick={() => navigate('/auth?mode=login')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-titan text-xl px-8 py-3 h-auto rounded-xl"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate('/auth?mode=register')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-titan text-xl px-8 py-3 h-auto rounded-xl"
          >
            Register
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-start justify-center min-h-[80vh] p-12">
        <div className="max-w-2xl">
          {/* Logo */}
          <h1 className="text-8xl text-white font-titan mb-8">
            Oranget
          </h1>
          
          {/* Subtitle */}
          <h2 className="text-4xl text-white font-titan mb-6">
            First Private Server
          </h2>
          
          {/* Description */}
          <p className="text-xl text-gray-300 font-titan mb-12 max-w-lg leading-relaxed">
            The first ever open-source Blooket private server created by the Oranget team written entirely in React.
          </p>
          
          {/* Action Button */}
          <Button
            onClick={() => navigate('/auth?mode=register')}
            className="w-48 bg-gray-700 hover:bg-gray-600 text-white text-xl font-titan py-4 h-auto rounded-xl"
          >
            Get Started
          </Button>
          
          {/* Bottom Text */}
          <div className="mt-16">
            <div className="flex items-center space-x-2 text-gray-400 text-sm font-titan">
              <span>🔊</span>
              <span>Pronunciation ("Orange-it")</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}