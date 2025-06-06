
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Send, MessageCircle } from 'lucide-react'
import { supabase } from "@/integrations/supabase/client"

interface Message {
  id: string
  username: string
  text: string
  timestamp: string
  user_id: string
  blook_pfp?: string
}

export default function Community() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (user) {
      // Initialize ping sound
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dw0X0jCCZv1OzJgzIGGH/I9tp7MgUYVq7j6qZUFAhBmN7sXg==')
      
      loadMessages()
      
      const channel = supabase
        .channel('messages_realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          async (payload) => {
            const newMessage = payload.new as Message
            
            // Get blook pfp for the new message
            const { data: profile } = await supabase
              .from('profiles')
              .select('selected_blook_pfp')
              .eq('id', newMessage.user_id)
              .single()

            const messageWithBlook = {
              ...newMessage,
              blook_pfp: profile?.selected_blook_pfp || '🧡'
            }
            
            if (newMessage.text.includes(`@${user?.username}`) && newMessage.user_id !== user?.id) {
              if (audioRef.current) {
                audioRef.current.play().catch(e => console.log('Could not play sound:', e))
              }
              
              toast({
                title: "You've been pinged!",
                description: `${newMessage.username} mentioned you in chat`,
              })
            }
            setMessages(prev => [...prev, messageWithBlook])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user])

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(100)

      if (error) {
        console.error('Error loading messages:', error)
        return
      }

      const messagesWithBlooks = await Promise.all(data.map(async (message) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('selected_blook_pfp')
          .eq('id', message.user_id)
          .single()

        return {
          ...message,
          blook_pfp: profile?.selected_blook_pfp || '🧡'
        }
      }))

      setMessages(messagesWithBlooks)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || isLoading) return

    setIsLoading(true)
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          username: user.username || 'Anonymous',
          text: newMessage.trim()
        })

      if (error) {
        throw error
      }

      setNewMessage('')
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatMessageWithPings = (content: string) => {
    const parts = content.split(/(@\w+)/g)
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const username = part.slice(1)
        const isCurrentUser = username === user?.username
        return (
          <span
            key={index}
            className={`font-bold ${isCurrentUser ? 'bg-orange-400 text-white px-1 rounded' : 'text-blue-300'}`}
          >
            {part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        <div className="falling-blooks"></div>
        
        <AppSidebar />
        
        <main className="flex-1 relative z-10 flex flex-col h-screen">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-orange-600 border-b-4 border-orange-400 shrink-0">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="blacket-button p-2" />
              <div>
                <h1 className="text-3xl text-white font-bold drop-shadow-lg titan-one-light">
                  Chat
                </h1>
                <p className="text-orange-100 mt-1 font-medium titan-one-light">
                  Talk with other players • Live
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm titan-one-light">LIVE</span>
              <MessageCircle className="w-8 h-8 text-white ml-2" />
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-orange-500/20 backdrop-blur-sm">
            {messages.length === 0 ? (
              <div className="text-center text-white/70 font-medium titan-one-light mt-20">
                No messages yet. Start the conversation! Use @username to ping someone.
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="mb-4 flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-white/30">
                    <span className="text-2xl" title={`${message.username}'s Blook`}>
                      {message.blook_pfp || '🧡'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold titan-one-light text-sm text-white">
                        {message.username}
                      </span>
                      <span className="text-xs text-white/60 titan-one-light">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-white titan-one-light bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                      {formatMessageWithPings(message.text)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 border-t-2 border-orange-400 shrink-0">
            <div className="flex space-x-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... Use @username to ping someone"
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-lg titan-one-light backdrop-blur-sm"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isLoading}
                className="blacket-button px-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
