
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast'
import { Music, Search, Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react'

interface Song {
  id: string
  name: string
  artist: string
  album: string
  duration: string
  image: string
  preview_url?: string
}

export default function MusicPage() {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  const mockSongs: Song[] = [
    {
      id: '1',
      name: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:20',
      image: '/placeholder.svg'
    },
    {
      id: '2',
      name: 'Watermelon Sugar',
      artist: 'Harry Styles',
      album: 'Fine Line',
      duration: '2:54',
      image: '/placeholder.svg'
    },
    {
      id: '3',
      name: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      duration: '3:23',
      image: '/placeholder.svg'
    }
  ]

  const handleSpotifyConnect = async () => {
    // Demo connection
    toast({
      title: "Connecting to Spotify...",
      description: "You'll be redirected to Spotify to authorize the connection.",
    })
    
    setTimeout(() => {
      setIsConnected(true)
      toast({
        title: "Connected to Spotify!",
        description: "You can now search and play music.",
      })
    }, 2000)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    
    setTimeout(() => {
      const filteredSongs = mockSongs.filter(song => 
        song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSongs(filteredSongs.length > 0 ? filteredSongs : mockSongs)
      setLoading(false)
    }, 1000)
  }

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    toast({
      title: `Now playing: ${song.name}`,
      description: `by ${song.artist}`,
    })
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        {/* Orange Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
          <div 
            className="w-full h-full opacity-30"
            style={{
              backgroundImage: 'url("https://i.ibb.co/S4BD0J48/download.png")',
              animation: 'animatedBackground 9s linear infinite'
            }}
          />
        </div>

        <AppSidebar />
        
        <main className="flex-1 relative z-10 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-600 rounded-xl text-white bg-orange-500/50" />
                <div>
                  <h1 className="text-5xl text-white font-medium drop-shadow-lg">Music</h1>
                  <p className="text-orange-100 mt-1 text-xl font-medium">Listen to your favorite songs!</p>
                </div>
              </div>
              <Music className="w-12 h-12 text-white" />
            </div>

            {!isConnected ? (
              /* Spotify Connection */
              <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl mb-8">
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-medium flex items-center justify-center space-x-3 text-white">
                    <Music className="w-10 h-10" />
                    <span>Connect to Spotify</span>
                  </CardTitle>
                  <p className="text-xl opacity-90 text-orange-100 font-medium">Connect your Spotify account to search and play music</p>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={handleSpotifyConnect}
                    className="bg-white text-orange-600 hover:bg-orange-50 text-xl font-medium py-4 px-8 rounded-full border-2 border-orange-300"
                  >
                    Connect Spotify Account
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Search Bar */}
                <Card className="mb-8 border-4 border-orange-300 bg-orange-500/80 backdrop-blur-sm rounded-3xl">
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for songs, artists, albums..."
                        className="flex-1 text-xl border-2 border-orange-200 rounded-2xl py-4 bg-orange-400/50 text-white placeholder:text-orange-100 font-medium"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button 
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-orange-400 hover:bg-orange-500 text-white text-xl font-medium px-8 rounded-2xl border-2 border-orange-200"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Search className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Songs List */}
                <div className="grid gap-4 mb-8">
                  {songs.map((song) => (
                    <Card 
                      key={song.id}
                      className="group hover:shadow-lg transition-all duration-300 hover:scale-102 border-4 border-orange-300 bg-orange-500/70 backdrop-blur-sm rounded-3xl"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={song.image} 
                            alt={song.album}
                            className="w-16 h-16 rounded-lg object-cover border-2 border-orange-200"
                          />
                          <div className="flex-1">
                            <h3 className="text-xl font-medium text-white">{song.name}</h3>
                            <p className="text-orange-100 text-lg font-medium">{song.artist}</p>
                            <p className="text-orange-200 font-medium">{song.album} • {song.duration}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-orange-100 hover:text-white hover:bg-orange-400 rounded-full"
                            >
                              <Heart className="w-5 h-5" />
                            </Button>
                            <Button
                              onClick={() => handlePlaySong(song)}
                              className="bg-orange-400 hover:bg-orange-500 text-white rounded-full px-6 py-3 font-medium border-2 border-orange-200"
                            >
                              <Play className="w-5 h-5 mr-2" />
                              Play
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Music Player */}
                {currentSong && (
                  <Card className="fixed bottom-6 left-6 right-6 bg-orange-500/90 backdrop-blur-sm text-white border-4 border-orange-300 z-50 rounded-3xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={currentSong.image} 
                            alt={currentSong.album}
                            className="w-14 h-14 rounded-lg object-cover border-2 border-orange-200"
                          />
                          <div>
                            <h4 className="text-lg font-medium">{currentSong.name}</h4>
                            <p className="text-orange-200 font-medium">{currentSong.artist}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-orange-400">
                            <SkipBack className="w-5 h-5" />
                          </Button>
                          <Button 
                            onClick={togglePlayPause}
                            variant="ghost" 
                            size="icon" 
                            className="text-white hover:bg-orange-400 w-12 h-12"
                          >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-orange-400">
                            <SkipForward className="w-5 h-5" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-5 h-5" />
                          <div className="w-24 h-2 bg-orange-300 rounded-full">
                            <div className="w-3/4 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
