
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Send, Users, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  username: string
  content: string
  timestamp: number
}

export default function Community() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load existing messages
    const savedMessages = JSON.parse(localStorage.getItem('oranget_messages') || '[]')
    setMessages(savedMessages)

    // Set up WebSocket connection for real-time chat
    const ws = new WebSocket('wss://echo.websocket.org/')
    wsRef.current = ws

    ws.onopen = () => {
      console.log('Connected to chat server')
    }

    ws.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data)
        if (message.username !== user?.username) {
          setMessages(prev => {
            const exists = prev.some(m => m.id === message.id)
            if (!exists) {
              const updated = [...prev, message]
              localStorage.setItem('oranget_messages', JSON.stringify(updated))
              return updated
            }
            return prev
          })
        }
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      ws.close()
    }
  }, [user])

  const sendMessage = () => {
    if (!newMessage.trim() || !user || isTyping) return

    setIsTyping(true)
    
    const message: Message = {
      id: `${Date.now()}-${Math.random()}`,
      username: user.username,
      content: newMessage.trim(),
      timestamp: Date.now()
    }

    // Add to local messages immediately
    setMessages(prev => {
      const updated = [...prev, message]
      localStorage.setItem('oranget_messages', JSON.stringify(updated))
      return updated
    })

    // Send via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }

    setNewMessage('')
    setTimeout(() => setIsTyping(false), 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
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
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-600 rounded-xl text-white bg-orange-500/50" />
                <div>
                  <h1 className="text-4xl text-white font-bold drop-shadow-lg font-fredoka">Community Chat</h1>
                  <p className="text-orange-100 mt-1 font-medium font-fredoka">Connect with other players!</p>
                </div>
              </div>
              <MessageCircle className="w-12 h-12 text-white" />
            </div>

            {/* Chat Container */}
            <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl text-white font-bold font-fredoka flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 bg-orange-400/30 rounded-2xl p-4 mb-4 overflow-y-auto max-h-96">
                  {messages.length === 0 ? (
                    <div className="text-center text-orange-100 font-medium font-fredoka">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-3 p-3 rounded-2xl max-w-xs ${
                          message.username === user?.username
                            ? 'bg-orange-500 text-white ml-auto'
                            : 'bg-orange-300 text-orange-900'
                        }`}
                      >
                        <div className="font-bold text-sm font-fredoka">{message.username}</div>
                        <div className="font-medium font-fredoka">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1 font-fredoka">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="flex space-x-3">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-orange-400/50 border-2 border-orange-200 text-white placeholder:text-orange-100 rounded-2xl font-medium font-fredoka"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isTyping}
                    className="bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-2xl px-6 border-2 border-orange-200 font-fredoka"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
