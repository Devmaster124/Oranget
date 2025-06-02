
import { useState, useEffect } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Send, Users } from 'lucide-react'
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
      console.log('Opening trade interface')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-['Titan_One']">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-2xl font-black">Loading community...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-400 to-orange-600 font-['Titan_One']">
        <AppSidebar />
        
        {/* Main Chat Container */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-black/20 p-4 border-b-2 border-orange-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-white hover:bg-orange-400/20 rounded-xl p-2" />
                <h1 className="text-3xl text-white font-black">Community Chat</h1>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Users className="w-6 h-6" />
                <span className="text-lg font-black">
                  {messages.length > 0 ? new Set(messages.map(m => m.user_id)).size : 0} online
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-orange-400/20 to-orange-500/20">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <img 
                    src="/lovable-uploads/09e55504-38cb-49bf-9019-48c875713ca7.png"
                    alt="User Icon"
                    className="w-12 h-12 rounded-lg border-2 border-white shadow-lg"
                  />
                  <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-orange-200 shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span 
                        className="text-lg font-black text-orange-600 cursor-pointer hover:text-orange-800 transition-colors"
                        onClick={() => handleUsernameClick(message.user_id, message.username)}
                      >
                        {message.username}
                      </span>
                      <span className="text-sm text-orange-400 font-bold">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-800 text-lg font-medium">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-black/20 p-4 border-t-2 border-orange-300">
            <form onSubmit={sendMessage} className="flex space-x-4">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-2 border-orange-200 rounded-2xl text-lg py-3 px-4 bg-white/90 font-medium focus:border-orange-400"
                maxLength={500}
                style={{ width: '80%' }}
              />
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 rounded-2xl text-lg font-black"
              >
                <Send className="w-5 h-5 mr-2" />
                Send
              </Button>
            </form>
          </div>
        </main>

        {showUserProfile && selectedUserId && (
          <UserProfile
            userId={selectedUserId}
            username={selectedUsername}
            isOpen={showUserProfile}
            onClose={() => setShowUserProfile(false)}
            onTradeRequest={handleTradeRequest}
          />
        )}

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
