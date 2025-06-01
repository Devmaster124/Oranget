
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Search } from 'lucide-react'

export default function MusicPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('No track selected')
  const [searchQuery, setSearchQuery] = useState('')
  const [volume, setVolume] = useState(50)

  // Featured playlists
  const featuredPlaylists = [
    {
      id: 1,
      name: "Gaming Beats",
      description: "Perfect music for gaming sessions",
      image: "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      tracks: 25
    },
    {
      id: 2,
      name: "Chill Vibes",
      description: "Relaxing music for study and focus",
      image: "https://images.pexels.com/photos/3944092/pexels-photo-3944092.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      tracks: 30
    },
    {
      id: 3,
      name: "Electronic Mix",
      description: "High energy electronic music",
      image: "https://images.pexels.com/photos/3944093/pexels-photo-3944093.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      tracks: 20
    }
  ]

  const handleSpotifyConnect = () => {
    // This would normally redirect to Spotify OAuth
    alert('Spotify integration would be configured here. You would need to set up Spotify Web API credentials.')
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-100 rounded-xl" />
                <div>
                  <h1 className="text-4xl text-purple-600 flex items-center">
                    <Music className="w-10 h-10 mr-3" />
                    Music Player
                  </h1>
                  <p className="text-purple-500 mt-1">Listen to your favorite tracks while gaming!</p>
                </div>
              </div>
            </div>

            {/* Spotify Connect Card */}
            <Card className="mb-8 bg-gradient-to-r from-green-500 to-green-600 text-white border-4 border-green-400 rounded-3xl">
              <CardHeader>
                <CardTitle className="text-3xl font-black flex items-center">
                  <Music className="w-8 h-8 mr-3" />
                  Connect to Spotify
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-100 mb-4 text-lg">
                  Connect your Spotify account to access millions of songs and your personal playlists!
                </p>
                <Button 
                  onClick={handleSpotifyConnect}
                  className="bg-white text-green-600 hover:bg-green-50 font-black text-lg px-8 py-3 rounded-2xl"
                >
                  Connect Spotify Account
                </Button>
              </CardContent>
            </Card>

            {/* Search Bar */}
            <Card className="mb-8 bg-white/80 backdrop-blur-sm border-4 border-purple-200 rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Search className="w-6 h-6 text-purple-500" />
                  <Input
                    placeholder="Search for songs, artists, or albums..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 h-12 text-lg border-3 border-purple-200 rounded-xl focus:border-purple-400"
                  />
                  <Button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl">
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Music Player Controls */}
            <Card className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-4 border-purple-300 rounded-3xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black mb-2">Now Playing</h3>
                  <p className="text-purple-100 text-lg">{currentTrack}</p>
                </div>
                
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <Button className="bg-white/20 hover:bg-white/30 p-3 rounded-full">
                    <SkipBack className="w-6 h-6" />
                  </Button>
                  
                  <Button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-white text-purple-600 hover:bg-purple-50 p-4 rounded-full"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </Button>
                  
                  <Button className="bg-white/20 hover:bg-white/30 p-3 rounded-full">
                    <SkipForward className="w-6 h-6" />
                  </Button>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <Volume2 className="w-5 h-5" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-32 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm">{volume}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Featured Playlists */}
            <div className="mb-8">
              <h2 className="text-3xl text-purple-600 font-black mb-6">Featured Playlists</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPlaylists.map((playlist) => (
                  <Card 
                    key={playlist.id}
                    className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-purple-200 bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={playlist.image} 
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-xl text-purple-600">{playlist.name}</CardTitle>
                      <p className="text-purple-500">{playlist.description}</p>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 font-bold">{playlist.tracks} tracks</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Integration Info */}
            <Card className="bg-orange-100 border-4 border-orange-200 rounded-3xl">
              <CardContent className="p-8 text-center">
                <Music className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-2xl text-orange-600 font-black mb-4">Music Integration</h3>
                <p className="text-orange-700 text-lg">
                  To fully enable music functionality, you would need to integrate with music services like:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white rounded-2xl p-4 border-2 border-orange-200">
                    <h4 className="font-black text-green-600">Spotify Web API</h4>
                    <p className="text-sm text-gray-600">Access millions of tracks</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border-2 border-orange-200">
                    <h4 className="font-black text-red-600">YouTube Music API</h4>
                    <p className="text-sm text-gray-600">Stream from YouTube</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 border-2 border-orange-200">
                    <h4 className="font-black text-purple-600">Apple Music API</h4>
                    <p className="text-sm text-gray-600">Apple's music library</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
