import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Send, Users, MessageCircle, Crown, Bell } from 'lucide-react'
import UserProfile from '@/components/UserProfile'
import TradeRequest from '@/components/TradeRequest'
import Trading from '@/components/Trading'

interface Message {
  id: string
  text: string
  username: string
  user_id: string
  created_at: string
}

export default function Community() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [onlineUsers] = useState(Math.floor(Math.random() * 500) + 100)
  
  // Profile and trading states
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUsername, setSelectedUsername] = useState<string>('')
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [pendingTradeRequest, setPendingTradeRequest] = useState<any>(null)
  const [activeTrade, setActiveTrade] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchMessages()
      subscribeToMessages()
      subscribeToTradeRequests()
    }
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const subscribeToTradeRequests = () => {
    if (!user) return

    const channel = supabase
      .channel('trade_requests_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trade_requests',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          setPendingTradeRequest(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  const checkSpamLimit = async () => {
    try {
      const { data, error } = await supabase.rpc('check_message_spam', {
        user_id_param: user?.id
      })
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error checking spam limit:', error)
      return false
    }
  }

  const updateRateLimit = async () => {
    try {
      const now = new Date().toISOString()
      
      const { data: currentData } = await supabase
        .from('user_message_rate_limit')
        .select('message_timestamps')
        .eq('user_id', user?.id)
        .single()
      
      let timestamps = currentData?.message_timestamps || []
      timestamps.push(now)
      
      const cutoff = new Date(Date.now() - 4300).toISOString()
      timestamps = timestamps.filter((ts: string) => ts > cutoff)
      
      await supabase
        .from('user_message_rate_limit')
        .upsert({
          user_id: user?.id,
          message_timestamps: timestamps
        })
    } catch (error) {
      console.error('Error updating rate limit:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || sending) return

    const isSpam = await checkSpamLimit()
    if (isSpam) {
      toast({
        title: "Slow down! 🐌",
        description: "You're sending messages too quickly. Please wait a moment.",
        variant: "destructive"
      })
      return
    }

    setSending(true)
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, total_messages_sent')
        .eq('id', user.id)
        .single()

      const { error } = await supabase
        .from('messages')
        .insert({
          text: newMessage.trim(),
          user_id: user.id,
          username: profile?.username || 'Anonymous'
        })

      if (error) throw error

      await updateRateLimit()
      
      await supabase
        .from('profiles')
        .update({ 
          total_messages_sent: (profile?.total_messages_sent || 0) + 1
        })
        .eq('id', user.id)

      setNewMessage('')
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again.",
        variant: "destructive"
      })
    } finally {
      setSending(false)
    }
  }

  const handleUsernameClick = (userId: string, username: string) => {
    if (userId === user?.id) return // Don't allow clicking on own username
    
    setSelectedUserId(userId)
    setSelectedUsername(username)
    setShowUserProfile(true)
  }

  const handleTradeRequest = async (targetUserId: string, targetUsername: string) => {
    try {
      const { data, error } = await supabase
        .from('trade_requests')
        .insert({
          sender_id: user?.id,
          receiver_id: targetUserId,
          status: 'pending'
        })
        .select()
        .single()
      
      if (error) throw error
      
      toast({
        title: "Trade request sent!",
        description: `Your trade request has been sent to ${targetUsername}.`,
      })
    } catch (error: any) {
      console.error('Error sending trade request:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to send trade request.",
        variant: "destructive"
      })
    }
  }

  const handleTradeResponse = (accepted: boolean) => {
    if (accepted && pendingTradeRequest) {
      setActiveTrade(pendingTradeRequest.id)
    }
    setPendingTradeRequest(null)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 font-fredoka">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b-4 border-orange-200 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-100 rounded-xl" />
                <div>
                  <h1 className="text-4xl font-fredoka text-orange-600 font-black drop-shadow-lg flex items-center">
                    <Users className="w-10 h-10 mr-3" />
                    Community Chat
                  </h1>
                  <p className="text-orange-500 mt-1 font-bold flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    {onlineUsers} players online • Click usernames to view profiles and trade!
                  </p>
                </div>
              </div>
              
              {pendingTradeRequest && (
                <div className="flex items-center space-x-2 bg-orange-100 border-2 border-orange-300 rounded-2xl px-4 py-2">
                  <Bell className="w-5 h-5 text-orange-600 animate-bounce" />
                  <span className="text-orange-700 font-bold">Incoming trade request!</span>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col p-6">
            <Card className="flex-1 bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-b-4 border-orange-300">
                <CardTitle className="text-2xl font-black flex items-center">
                  <MessageCircle className="w-8 h-8 mr-3" />
                  Global Chat Room
                  <div className="ml-auto flex items-center space-x-2">
                    <Crown className="w-6 h-6 text-yellow-300" />
                    <span className="text-lg font-bold">Free for Everyone!</span>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-orange-600 font-bold">Loading messages...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div 
                          key={message.id}
                          className={`flex items-start space-x-3 p-3 rounded-2xl transition-all duration-300 hover:bg-orange-50 ${
                            message.user_id === user?.id ? 'bg-orange-100 ml-8' : 'mr-8'
                          }`}
                        >
                          <Avatar className="w-10 h-10 border-2 border-orange-300 shadow-md">
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-black text-lg">
                              {message.username[0]?.toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <button
                                onClick={() => handleUsernameClick(message.user_id, message.username)}
                                className={`font-black text-orange-700 hover:text-orange-900 hover:underline transition-colors ${
                                  message.user_id === user?.id ? 'cursor-default hover:no-underline' : 'cursor-pointer'
                                }`}
                                disabled={message.user_id === user?.id}
                              >
                                {message.username}
                              </button>
                              <span className="text-xs text-orange-500 font-bold">
                                {formatTime(message.created_at)}
                              </span>
                              {message.user_id === user?.id && (
                                <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-gray-800 font-bold break-words">{message.text}</p>
                          </div>
                        </div>
                      ))}
                      {messages.length === 0 && !loading && (
                        <div className="text-center py-12">
                          <MessageCircle className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                          <p className="text-orange-500 font-bold text-xl">No messages yet!</p>
                          <p className="text-orange-400 font-bold">Be the first to say hello! 👋</p>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>

                <div className="p-6 border-t-4 border-orange-200 bg-orange-50/50">
                  <form onSubmit={sendMessage} className="flex space-x-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here... (click usernames to trade!)"
                      className="flex-1 h-12 text-lg font-bold border-4 border-orange-200 rounded-2xl focus:border-orange-400 bg-white"
                      disabled={sending}
                      maxLength={2000}
                    />
                    <Button 
                      type="submit" 
                      disabled={!newMessage.trim() || sending}
                      className="h-12 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black rounded-2xl border-4 border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {sending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </form>
                  <p className="text-orange-500 text-sm font-bold mt-2">
                    💬 Chat freely! Click usernames to view profiles and trade. Spam protection: max 10 messages per 4.3 seconds
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        {/* Modals */}
        {showUserProfile && selectedUserId && (
          <UserProfile
            userId={selectedUserId}
            username={selectedUsername}
            isOpen={showUserProfile}
            onClose={() => setShowUserProfile(false)}
            onTradeRequest={handleTradeRequest}
          />
        )}
        
        {pendingTradeRequest && (
          <TradeRequest
            tradeRequest={pendingTradeRequest}
            onResponse={handleTradeResponse}
          />
        )}
        
        {activeTrade && (
          <Trading
            tradeId={activeTrade}
            isOpen={!!activeTrade}
            onClose={() => setActiveTrade(null)}
          />
        )}
      </div>
    </SidebarProvider>
  )
}
