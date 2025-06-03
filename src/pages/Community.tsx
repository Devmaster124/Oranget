
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Send, Users, Circle } from 'lucide-react'

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
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load existing messages from localStorage
    const storedMessages = localStorage.getItem('oranget_messages')
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    }

    // Initialize WebSocket connection for real-time updates
    initializeWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [user])

  const initializeWebSocket = () => {
    try {
      // For demonstration, using a local WebSocket simulation
      // In production, this would connect to a real WebSocket server
      const ws = new WebSocket('wss://echo.websocket.org/') // Demo server
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setConnected(true)
        if (user) {
          // Notify server that user is online
          ws.send(JSON.stringify({
            type: 'user_online',
            username: user.username,
            userId: user.id
          }))
        }
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'new_message') {
            const message: Message = {
              id: data.id,
              text: data.text,
              created_at: data.created_at,
              user_id: data.user_id,
              username: data.username
            }
            
            setMessages(prev => {
              const updated = [...prev, message]
              localStorage.setItem('oranget_messages', JSON.stringify(updated))
              return updated
            })
          } else if (data.type === 'users_online') {
            setOnlineUsers(data.users)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setConnected(false)
        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (user) {
            initializeWebSocket()
          }
        }, 3000)
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnected(false)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Error initializing WebSocket:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || loading) return

    setLoading(true)
    try {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        created_at: new Date().toISOString(),
        user_id: user.id,
        username: user.username
      }

      // Send to WebSocket if connected
      if (wsRef.current && connected) {
        wsRef.current.send(JSON.stringify({
          type: 'new_message',
          ...message
        }))
      }

      // Always store locally as backup
      const updatedMessages = [...messages, message]
      setMessages(updatedMessages)
      localStorage.setItem('oranget_messages', JSON.stringify(updatedMessages))
      setNewMessage('')

      toast({
        title: "Message sent!",
        description: "Your message has been posted to the chat.",
      })
    } catch (error: any) {
      console.error('Error sending message:', error)
      toast({
        title: "Error sending message",
        description: "Failed to send message",
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
        
        <main className="flex-1 relative z-10 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-orange-600/80 backdrop-blur-sm border-b-4 border-orange-300 shrink-0">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-orange-700 rounded-xl text-white" />
              <div>
                <h1 className="text-4xl text-white font-medium drop-shadow-lg">Chat</h1>
                <p className="text-orange-100 mt-1 font-medium">Connect with the community!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <Circle className={`w-3 h-3 ${connected ? 'text-green-400 fill-green-400' : 'text-red-400 fill-red-400'}`} />
                <span className="text-sm font-medium">{connected ? 'Connected' : 'Connecting...'}</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Users className="w-5 h-5" />
                <span className="font-medium">{onlineUsers.length} online</span>
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
                <div key={message.id} className="flex items-start space-x-3 bg-orange-500/60 backdrop-blur-sm p-4 rounded-2xl border-2 border-orange-300">
                  <img 
                    src="/lovable-uploads/09e55504-38cb-49bf-9019-48c875713ca7.png"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-lg border-2 border-orange-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-medium text-lg">
                        {message.username || 'User'}
                      </span>
                      {onlineUsers.includes(message.username) && (
                        <Circle className="w-2 h-2 text-green-400 fill-green-400" />
                      )}
                      <span className="text-orange-100 text-sm font-medium">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                    <p className="text-orange-50 font-medium break-words">
                      {message.text}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 bg-orange-600/80 backdrop-blur-sm border-t-4 border-orange-300 shrink-0">
              <form onSubmit={sendMessage} className="flex space-x-4">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  maxLength={500}
                  className="flex-1 bg-orange-500/50 border-2 border-orange-300 text-white placeholder:text-orange-100 font-medium text-lg py-4 rounded-2xl focus:border-orange-200"
                  disabled={loading || !connected}
                />
                <Button
                  type="submit"
                  disabled={loading || !newMessage.trim() || !connected}
                  className="bg-orange-400 hover:bg-orange-500 text-white font-medium py-4 px-6 rounded-2xl border-2 border-orange-200 h-auto"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
              {!connected && (
                <p className="text-orange-200 text-sm mt-2 text-center font-medium">
                  Reconnecting to chat...
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
