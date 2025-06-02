
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Send } from 'lucide-react'

interface Message {
  id: string
  text: string
  created_at: string
  user_id: string
  username: string
}

export default function Community() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' }, 
        (payload) => {
          console.log('New message received:', payload.new)
          fetchMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50)

      if (error) throw error
      setMessages(data || [])
    } catch (error: any) {
      console.error('Error fetching messages:', error)
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || loading) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            text: newMessage.trim(),
            user_id: user.id,
            username: user.user_metadata?.username || 'User'
          }
        ])

      if (error) throw error

      setNewMessage('')
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900">
          <div 
            className="w-full h-full opacity-30"
            style={{
              backgroundImage: 'url("https://i.ibb.co/S4BD0J48/download.png")',
              animation: 'animatedBackground 9s linear infinite'
            }}
          />
        </div>

        <AppSidebar />
        
        <main className="flex-1 relative z-10 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-orange-800/80 backdrop-blur-sm border-b-4 border-orange-400 shrink-0">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-orange-700 rounded-xl text-white" />
              <div>
                <h1 className="text-4xl text-white font-black drop-shadow-lg">Chat</h1>
                <p className="text-orange-200 mt-1 font-bold">Connect with the community!</p>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 flex flex-col relative">
            {/* Messages Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4"
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            >
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3 bg-orange-800/60 backdrop-blur-sm p-4 rounded-2xl border-2 border-orange-400">
                  <img 
                    src="/lovable-uploads/09e55504-38cb-49bf-9019-48c875713ca7.png"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-lg border-2 border-orange-300 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-black text-lg">
                        {message.username || 'User'}
                      </span>
                      <span className="text-orange-200 text-sm font-bold">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                    <p className="text-orange-100 font-bold break-words">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 bg-orange-800/80 backdrop-blur-sm border-t-4 border-orange-400 shrink-0">
              <form onSubmit={sendMessage} className="flex space-x-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  maxLength={500}
                  className="flex-1 bg-orange-700/50 border-2 border-orange-400 text-white placeholder:text-orange-200 font-bold text-lg py-4 rounded-2xl focus:border-orange-200"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={loading || !newMessage.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-6 rounded-2xl border-2 border-orange-300 h-auto"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
