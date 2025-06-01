
import { useState, useEffect } from 'react'
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
import { Send, Users, MessageCircle, Crown } from 'lucide-react'
import UserProfile from '@/components/UserProfile'
import TradeRequest from '@/components/TradeRequest'

interface Message {
  id: string
  text: string
  username: string
  user_id: string
  timestamp: string
  created_at: string
}

export default function Community() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedUsername, setSelectedUsername] = useState<string>('')
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [tradeRequest, setTradeRequest] = useState<any>(null)

  useEffect(() => {
    if (user) {
      fetchMessages()
      subscribeToMessages()
      checkForTradeRequests()
    }
  }, [user])

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
      .channel('messages_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message received:', payload.new)
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const checkForTradeRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('trade_requests')
        .select('*')
        .eq('receiver_id', user?.id)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (data) {
        setTradeRequest(data)
      }
    } catch (error) {
      console.error('Error checking trade requests:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          text: newMessage.trim(),
          username: user.email?.split('@')[0] || 'Anonymous',
          user_id: user.id,
          timestamp: new Date().toISOString()
        })

      if (error) throw error
      setNewMessage('')
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleUsernameClick = (userId: string, username: string) => {
    if (userId === user?.id) return
    setSelectedUserId(userId)
    setSelectedUsername(username)
    setShowUserProfile(true)
  }

  const handleTradeRequest = async (userId: string, username: string) => {
    try {
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + 10)

      const { error } = await supabase
        .from('trade_requests')
        .insert({
          sender_id: user?.id,
          receiver_id: userId,
          expires_at: expiresAt.toISOString()
        })

      if (error) throw error

      toast({
        title: "Trade request sent!",
        description: `Your trade request has been sent to ${username}.`,
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
    setTradeRequest(null)
    if (accepted) {
      // Open trading interface
      console.log('Opening trade interface')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 text-2xl font-black">Loading community...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-purple-100">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-blue-100 rounded-xl" />
                <div>
                  <h1 className="text-5xl text-blue-600 font-black">Community</h1>
                  <p className="text-blue-500 mt-1 text-xl">Chat with other players!</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-blue-500">
                <Users className="w-8 h-8" />
                <span className="text-2xl font-black">{messages.length > 0 ? new Set(messages.map(m => m.user_id)).size : 0} online</span>
              </div>
            </div>

            {/* Chat Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-4 border-blue-200 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardTitle className="text-3xl font-black flex items-center">
                  <MessageCircle className="w-8 h-8 mr-3" />
                  Global Chat
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Messages */}
                <ScrollArea className="h-96 p-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex items-start space-x-3 group">
                        <Avatar className="w-12 h-12 border-2 border-blue-200">
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xl font-black">
                            {message.username[0]?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-100">
                          <div className="flex items-center space-x-2 mb-2">
                            <span 
                              className="text-lg font-black text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                              onClick={() => handleUsernameClick(message.user_id, message.username)}
                            >
                              {message.username}
                            </span>
                            {message.user_id === user?.id && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className="text-sm text-blue-400">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-800 text-lg">{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t-4 border-blue-200 p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                  <form onSubmit={sendMessage} className="flex space-x-4">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border-2 border-blue-200 rounded-2xl text-lg py-4"
                      maxLength={500}
                    />
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 rounded-2xl text-lg font-black"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* User Profile Modal */}
        {showUserProfile && selectedUserId && (
          <UserProfile
            userId={selectedUserId}
            username={selectedUsername}
            isOpen={showUserProfile}
            onClose={() => setShowUserProfile(false)}
            onTradeRequest={handleTradeRequest}
          />
        )}

        {/* Trade Request Modal */}
        {tradeRequest && (
          <TradeRequest
            tradeRequest={tradeRequest}
            onResponse={handleTradeResponse}
          />
        )}
      </div>
    </SidebarProvider>
  )
}
