
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Send, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  username: string
  content: string
  timestamp: number
  userRole?: string
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
      timestamp: Date.now(),
      userRole: 'Common'
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

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'Plus': return '#ff4757'
      case 'Plus+': return '#ff6b7a'
      case 'Common': return '#ffffff'
      default: return '#ffffff'
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        {/* Blook pattern background */}
        <div className="fixed inset-0" style={{
          backgroundColor: '#2c2f36',
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(139, 139, 139, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 139, 139, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(139, 139, 139, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: '100px 100px, 150px 150px, 80px 80px'
        }} />

        <AppSidebar />
        
        <main className="flex-1 relative z-10 p-6">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-gray-600 rounded-xl text-white bg-gray-700" />
                <div>
                  <h1 className="text-4xl text-white font-bold font-titan" style={{ fontWeight: '400' }}>
                    Chat
                  </h1>
                  <p className="text-gray-300 mt-1 font-medium font-titan" style={{ fontWeight: '400' }}>
                    Talk with other players
                  </p>
                </div>
              </div>
              <MessageCircle className="w-12 h-12 text-white" />
            </div>

            {/* Chat Container - Blacket style */}
            <div className="bg-gray-800 rounded-lg flex-1 flex flex-col border border-gray-600">
              <div className="bg-gray-700 p-4 rounded-t-lg border-b border-gray-600">
                <h2 className="text-white font-bold font-titan text-xl" style={{ fontWeight: '400' }}>
                  Live Chat
                </h2>
              </div>
              
              <div className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gray-800">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 font-medium font-titan" style={{ fontWeight: '400' }}>
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="mb-3 flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold font-titan" style={{ fontWeight: '400' }}>
                            {message.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span 
                              className="font-bold font-titan text-sm"
                              style={{ 
                                color: getRoleColor(message.userRole),
                                fontWeight: '400'
                              }}
                            >
                              {message.username}
                            </span>
                            {message.userRole && (
                              <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 font-titan" style={{ fontWeight: '400' }}>
                                [{message.userRole}]
                              </span>
                            )}
                            <span className="text-xs text-gray-500 font-titan" style={{ fontWeight: '400' }}>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-white font-titan" style={{ fontWeight: '400' }}>
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 bg-gray-700 rounded-b-lg border-t border-gray-600">
                  <div className="flex space-x-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-600 border-gray-500 text-white placeholder:text-gray-400 rounded-lg font-titan"
                      style={{ fontWeight: '400' }}
                      disabled={isTyping}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isTyping}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg px-6 border border-blue-500 font-titan"
                      style={{ fontWeight: '400' }}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
