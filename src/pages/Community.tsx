
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Users, Crown } from "lucide-react"
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Badge } from "@/components/ui/badge"
import { useQuery } from '@tanstack/react-query'

interface Message {
  id: string
  username: string
  text: string
  timestamp: string
  user_id: string
}

interface UserSubscription {
  subscribed: boolean
  subscription_tier: string | null
}

export default function Community() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers] = useState(Math.floor(Math.random() * 200) + 50)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  // Fetch user subscription status
  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_tier')
        .eq('user_id', user.id)
        .maybeSingle()
      return data as UserSubscription | null
    },
    enabled: !!user
  })

  const isPremium = subscription?.subscribed || false
  const maxMessageLength = isPremium ? 500 : 100

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!user) return

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(50)

      if (error) {
        console.error('Error fetching messages:', error)
        return
      }

      setMessages(data || [])
    }

    fetchMessages()

    // Set up real-time subscription
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message
          setMessages(prev => [...prev, newMessage].slice(-50))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    // Check message length
    if (newMessage.trim().length > maxMessageLength) {
      toast({
        title: "Message too long",
        description: `Maximum ${maxMessageLength} characters allowed. ${isPremium ? '' : 'Upgrade to Premium for longer messages!'}`,
        variant: "destructive"
      })
      return
    }

    try {
      // Check rate limiting
      const { data: rateLimitData } = await supabase
        .from('user_message_rate_limit')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      const now = new Date()
      
      if (rateLimitData) {
        const resetTime = new Date(rateLimitData.reset_at)
        if (now < resetTime && rateLimitData.message_count >= (isPremium ? 10 : 5)) {
          toast({
            title: "Rate limit exceeded",
            description: `Please wait before sending another message. ${isPremium ? '' : 'Premium users have higher limits!'}`,
            variant: "destructive"
          })
          return
        }
      }

      // Get username from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      const username = profile?.username || user.email?.split('@')[0] || 'Player'

      // Insert message
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          username: username,
          text: newMessage.trim(),
          timestamp: new Date().toISOString()
        })

      if (error) throw error

      // Update rate limiting
      await supabase
        .from('user_message_rate_limit')
        .upsert({
          user_id: user.id,
          last_message_at: new Date().toISOString(),
          message_count: rateLimitData ? rateLimitData.message_count + 1 : 1,
          reset_at: rateLimitData && new Date(rateLimitData.reset_at) > now 
            ? rateLimitData.reset_at 
            : new Date(Date.now() + 60000).toISOString() // 1 minute from now
        })

      setNewMessage('')
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleUpgrade = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout')
      if (error) throw error
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 to-orange-100 font-fredoka">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-100 rounded-xl" />
                <div>
                  <h1 className="text-4xl font-fredoka text-orange-600">Community Chat</h1>
                  <p className="text-orange-500 mt-1 font-fredoka">Connect with other players in real-time!</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {!isPremium && (
                  <Button
                    onClick={handleUpgrade}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 rounded-full font-fredoka"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </Button>
                )}
                
                <div className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full">
                  <Users className="w-5 h-5" />
                  <span className="font-fredoka font-bold">{onlineUsers} Online</span>
                </div>
              </div>
            </div>

            {/* Premium Status */}
            {isPremium && (
              <Card className="mb-6 bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300 border-2 rounded-3xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Crown className="w-6 h-6 text-purple-600" />
                    <span className="text-purple-700 font-fredoka font-bold text-lg">
                      Premium Member - {subscription?.subscription_tier}
                    </span>
                    <Badge variant="secondary" className="bg-purple-600 text-white">
                      Longer Messages • Higher Rate Limits
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chat Interface */}
            <Card className="border-orange-200 bg-white/70 backdrop-blur-sm rounded-3xl border-2 h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-700 font-fredoka text-xl">Live Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-4">
                {/* Messages Area */}
                <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-start space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${
                          msg.user_id === user?.id 
                            ? 'from-purple-400 to-purple-600' 
                            : 'from-orange-400 to-orange-600'
                        } rounded-full flex items-center justify-center border-2 border-white shadow-sm relative flex-shrink-0`}>
                          {/* Simple avatar face */}
                          <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2"></div>
                          <div className="w-2 h-2 bg-white rounded-full absolute top-2 right-2"></div>
                          <div className="w-0.5 h-0.5 bg-orange-800 rounded-full absolute top-2.5 left-2.5"></div>
                          <div className="w-0.5 h-0.5 bg-orange-800 rounded-full absolute top-2.5 right-2.5"></div>
                          <div className="w-3 h-1.5 bg-orange-800 rounded-full absolute bottom-2"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`font-fredoka font-bold ${
                              msg.user_id === user?.id ? 'text-purple-600' : 'text-orange-600'
                            }`}>
                              {msg.username}
                            </span>
                            {msg.user_id === user?.id && isPremium && (
                              <Crown className="w-4 h-4 text-purple-500" />
                            )}
                            <span className="text-xs text-orange-400 font-fredoka">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className={`rounded-2xl px-4 py-2 border ${
                            msg.user_id === user?.id 
                              ? 'bg-purple-50 border-purple-200' 
                              : 'bg-orange-50 border-orange-200'
                          }`}>
                            <p className="text-orange-800 font-fredoka">{msg.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="flex space-x-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Type your message... (${newMessage.length}/${maxMessageLength})`}
                    className="flex-1 border-orange-200 focus:border-orange-400 rounded-full font-fredoka"
                    maxLength={maxMessageLength}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 font-fredoka disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-orange-400 mt-2 text-center font-fredoka">
                  You're chatting as: <span className="font-bold text-orange-600">{user?.email?.split('@')[0] || 'Player'}</span>
                  {isPremium && <span className="text-purple-600 ml-2">👑 Premium</span>}
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
