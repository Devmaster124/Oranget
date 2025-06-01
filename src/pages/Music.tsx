
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
    // Spotify OAuth flow
    const clientId = 'your_spotify_client_id'
    const redirectUri = window.location.origin + '/music'
    const scopes = 'streaming user-read-email user-read-private user-library-read user-library-modify'
    
    const spotifyUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`
    
    toast({
      title: "Connecting to Spotify...",
      description: "You'll be redirected to Spotify to authorize the connection.",
    })
    
    // For demo purposes, just set as connected
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
    
    // Mock search results
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 to-pink-100">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-purple-100 rounded-xl" />
                <div>
                  <h1 className="text-5xl text-purple-600 font-black">Music</h1>
                  <p className="text-purple-500 mt-1 text-xl">Listen to your favorite songs!</p>
                </div>
              </div>
              <Music className="w-12 h-12 text-purple-500" />
            </div>

            {!isConnected ? (
              /* Spotify Connection */
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-4 border-green-300 mb-8">
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-black flex items-center justify-center space-x-3">
                    <Music className="w-10 h-10" />
                    <span>Connect to Spotify</span>
                  </CardTitle>
                  <p className="text-xl opacity-90">Connect your Spotify account to search and play music</p>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={handleSpotifyConnect}
                    className="bg-white text-green-600 hover:bg-green-50 text-xl font-black py-4 px-8 rounded-full"
                  >
                    Connect Spotify Account
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Search Bar */}
                <Card className="mb-8 border-4 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for songs, artists, albums..."
                        className="flex-1 text-xl border-2 border-purple-200 rounded-2xl py-4"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button 
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-purple-500 hover:bg-purple-600 text-white text-xl font-black px-8 rounded-2xl"
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
                      className="group hover:shadow-lg transition-all duration-300 hover:scale-102 border-2 border-purple-200 bg-white/70 backdrop-blur-sm"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={song.image} 
                            alt={song.album}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-xl font-black text-purple-700">{song.name}</h3>
                            <p className="text-purple-500 text-lg">{song.artist}</p>
                            <p className="text-purple-400">{song.album} • {song.duration}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-full"
                            >
                              <Heart className="w-5 h-5" />
                            </Button>
                            <Button
                              onClick={() => handlePlaySong(song)}
                              className="bg-purple-500 hover:bg-purple-600 text-white rounded-full px-6 py-3"
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
                  <Card className="fixed bottom-6 left-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-4 border-purple-300 z-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={currentSong.image} 
                            alt={currentSong.album}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="text-lg font-black">{currentSong.name}</h4>
                            <p className="text-purple-200">{currentSong.artist}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-purple-500">
                            <SkipBack className="w-5 h-5" />
                          </Button>
                          <Button 
                            onClick={togglePlayPause}
                            variant="ghost" 
                            size="icon" 
                            className="text-white hover:bg-purple-500 w-12 h-12"
                          >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-purple-500">
                            <SkipForward className="w-5 h-5" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-5 h-5" />
                          <div className="w-24 h-2 bg-purple-400 rounded-full">
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
