
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeftRight, Search, Users, Clock, CheckCircle, XCircle } from 'lucide-react'

interface TradeRequest {
  id: string
  from: string
  to: string
  fromItems: string[]
  toItems: string[]
  status: 'pending' | 'accepted' | 'declined'
  timestamp: number
}

interface FriendRequest {
  id: string
  from: string
  to: string
  status: 'pending' | 'accepted' | 'declined'
  timestamp: number
}

export default function Trading() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchUser, setSearchUser] = useState('')
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [friends, setFriends] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('trades')

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = () => {
    const savedTrades = JSON.parse(localStorage.getItem('oranget_trades') || '[]')
    const savedFriends = JSON.parse(localStorage.getItem('oranget_friend_requests') || '[]')
    const savedFriendsList = JSON.parse(localStorage.getItem('oranget_friends') || '[]')
    
    setTradeRequests(savedTrades.filter((trade: TradeRequest) => 
      trade.to === user?.username || trade.from === user?.username
    ))
    setFriendRequests(savedFriends.filter((req: FriendRequest) => 
      req.to === user?.username || req.from === user?.username
    ))
    setFriends(savedFriendsList.filter((friend: string) => friend !== user?.username))
  }

  const sendFriendRequest = () => {
    if (!searchUser.trim() || searchUser === user?.username) {
      toast({
        title: "Invalid User",
        description: "Please enter a valid username",
        variant: "destructive"
      })
      return
    }

    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      from: user!.username,
      to: searchUser,
      status: 'pending',
      timestamp: Date.now()
    }

    const savedRequests = JSON.parse(localStorage.getItem('oranget_friend_requests') || '[]')
    savedRequests.push(newRequest)
    localStorage.setItem('oranget_friend_requests', JSON.stringify(savedRequests))
    
    setFriendRequests(prev => [...prev, newRequest])
    setSearchUser('')
    
    toast({
      title: "Friend Request Sent!",
      description: `Friend request sent to ${searchUser}`,
    })
  }

  const sendTradeRequest = (targetUser: string) => {
    const newTrade: TradeRequest = {
      id: Date.now().toString(),
      from: user!.username,
      to: targetUser,
      fromItems: ['Common Blook', 'Rare Blook'],
      toItems: ['Epic Blook'],
      status: 'pending',
      timestamp: Date.now()
    }

    const savedTrades = JSON.parse(localStorage.getItem('oranget_trades') || '[]')
    savedTrades.push(newTrade)
    localStorage.setItem('oranget_trades', JSON.stringify(savedTrades))
    
    setTradeRequests(prev => [...prev, newTrade])
    
    toast({
      title: "Trade Request Sent!",
      description: `Trade request sent to ${targetUser}`,
    })
  }

  const respondToFriendRequest = (requestId: string, accept: boolean) => {
    const savedRequests = JSON.parse(localStorage.getItem('oranget_friend_requests') || '[]')
    const updatedRequests = savedRequests.map((req: FriendRequest) => 
      req.id === requestId ? { ...req, status: accept ? 'accepted' : 'declined' } : req
    )
    localStorage.setItem('oranget_friend_requests', JSON.stringify(updatedRequests))
    
    if (accept) {
      const request = savedRequests.find((req: FriendRequest) => req.id === requestId)
      if (request) {
        const savedFriends = JSON.parse(localStorage.getItem('oranget_friends') || '[]')
        savedFriends.push(request.from)
        localStorage.setItem('oranget_friends', JSON.stringify(savedFriends))
        setFriends(prev => [...prev, request.from])
      }
    }
    
    loadData()
    toast({
      title: accept ? "Friend Request Accepted!" : "Friend Request Declined",
      description: accept ? "You are now friends!" : "Friend request declined",
    })
  }

  const respondToTradeRequest = (requestId: string, accept: boolean) => {
    const savedTrades = JSON.parse(localStorage.getItem('oranget_trades') || '[]')
    const updatedTrades = savedTrades.map((trade: TradeRequest) => 
      trade.id === requestId ? { ...trade, status: accept ? 'accepted' : 'declined' } : trade
    )
    localStorage.setItem('oranget_trades', JSON.stringify(updatedTrades))
    
    loadData()
    toast({
      title: accept ? "Trade Accepted!" : "Trade Declined",
      description: accept ? "Trade completed successfully!" : "Trade declined",
    })
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
        
        <main className="flex-1 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-orange-600/80 backdrop-blur-sm border-b-4 border-orange-300">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-orange-700 rounded-xl text-white" />
              <div>
                <h1 className="text-4xl text-white font-bold drop-shadow-lg font-fredoka">Trading Hub</h1>
                <p className="text-orange-100 mt-1 font-medium font-fredoka">Trade blooks and make friends!</p>
              </div>
            </div>
            <ArrowLeftRight className="w-12 h-12 text-white" />
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              {/* Search Section */}
              <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold font-fredoka flex items-center">
                    <Search className="w-6 h-6 mr-2" />
                    Find Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Input
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      placeholder="Enter username..."
                      className="flex-1 text-lg border-2 border-orange-200 rounded-2xl py-3 bg-orange-400/50 text-white placeholder:text-orange-100 font-medium font-fredoka"
                    />
                    <Button 
                      onClick={sendFriendRequest}
                      className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-8 rounded-2xl border-2 border-orange-200 font-fredoka"
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Add Friend
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <div className="flex space-x-4 mb-6">
                <Button
                  onClick={() => setActiveTab('trades')}
                  variant={activeTab === 'trades' ? 'default' : 'outline'}
                  className={`font-bold px-6 py-3 rounded-2xl font-fredoka ${
                    activeTab === 'trades' 
                      ? 'bg-orange-400 text-white border-orange-200' 
                      : 'bg-transparent border-orange-300 text-orange-100 hover:bg-orange-400'
                  }`}
                >
                  <ArrowLeftRight className="w-5 h-5 mr-2" />
                  Trades
                </Button>
                <Button
                  onClick={() => setActiveTab('friends')}
                  variant={activeTab === 'friends' ? 'default' : 'outline'}
                  className={`font-bold px-6 py-3 rounded-2xl font-fredoka ${
                    activeTab === 'friends' 
                      ? 'bg-orange-400 text-white border-orange-200' 
                      : 'bg-transparent border-orange-300 text-orange-100 hover:bg-orange-400'
                  }`}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Friends
                </Button>
              </div>

              {/* Content */}
              {activeTab === 'trades' && (
                <div className="space-y-4">
                  <h3 className="text-2xl text-white font-bold font-fredoka">Trade Requests</h3>
                  {tradeRequests.length === 0 ? (
                    <Card className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                      <CardContent className="p-8 text-center">
                        <p className="text-xl text-orange-100 font-medium font-fredoka">No trade requests yet!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    tradeRequests.map((trade) => (
                      <Card key={trade.id} className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xl font-bold text-white font-fredoka">
                                {trade.from === user?.username ? `To: ${trade.to}` : `From: ${trade.from}`}
                              </h4>
                              <p className="text-orange-100 font-medium font-fredoka">
                                Offering: {trade.fromItems.join(', ')} → Requesting: {trade.toItems.join(', ')}
                              </p>
                              <p className="text-orange-200 text-sm font-fredoka">
                                {new Date(trade.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {trade.status === 'pending' && trade.to === user?.username && (
                                <>
                                  <Button
                                    onClick={() => respondToTradeRequest(trade.id, true)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl font-fredoka"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    onClick={() => respondToTradeRequest(trade.id, false)}
                                    variant="outline"
                                    className="border-red-300 text-red-200 hover:bg-red-500 font-bold rounded-xl font-fredoka"
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Decline
                                  </Button>
                                </>
                              )}
                              {trade.status !== 'pending' && (
                                <span className={`px-3 py-1 rounded-full text-sm font-bold font-fredoka ${
                                  trade.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                  {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'friends' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl text-white font-bold mb-4 font-fredoka">Friend Requests</h3>
                    {friendRequests.filter(req => req.status === 'pending').length === 0 ? (
                      <Card className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                        <CardContent className="p-6 text-center">
                          <p className="text-lg text-orange-100 font-medium font-fredoka">No pending friend requests</p>
                        </CardContent>
                      </Card>
                    ) : (
                      friendRequests.filter(req => req.status === 'pending').map((request) => (
                        <Card key={request.id} className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl mb-3">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-lg font-bold text-white font-fredoka">
                                  {request.from === user?.username ? `Sent to: ${request.to}` : `From: ${request.from}`}
                                </h4>
                                <p className="text-orange-200 text-sm font-fredoka">
                                  {new Date(request.timestamp).toLocaleString()}
                                </p>
                              </div>
                              {request.to === user?.username && (
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => respondToFriendRequest(request.id, true)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl font-fredoka"
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    onClick={() => respondToFriendRequest(request.id, false)}
                                    variant="outline"
                                    className="border-red-300 text-red-200 hover:bg-red-500 font-bold rounded-xl font-fredoka"
                                  >
                                    Decline
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl text-white font-bold mb-4 font-fredoka">Your Friends</h3>
                    {friends.length === 0 ? (
                      <Card className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                        <CardContent className="p-6 text-center">
                          <p className="text-lg text-orange-100 font-medium font-fredoka">No friends yet!</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {friends.map((friend, index) => (
                          <Card key={index} className="bg-orange-500/70 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-lg font-bold text-white font-fredoka">{friend}</h4>
                                <Button
                                  onClick={() => sendTradeRequest(friend)}
                                  className="bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-xl font-fredoka"
                                >
                                  Trade
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
