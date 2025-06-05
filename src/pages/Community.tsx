
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Send, MessageCircle, UserPlus, ArrowLeftRight } from 'lucide-react'

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
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
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

    // Initialize real-time connection
    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [user])

  const connectWebSocket = () => {
    // Simulate real-time with local storage polling
    const interval = setInterval(() => {
      const savedMessages = JSON.parse(localStorage.getItem('oranget_messages') || '[]')
      setMessages(savedMessages)
      
      // Simulate online users
      const users = ['Player1', 'Player2', 'OrangeKing', 'BlookMaster', user?.username].filter(Boolean)
      setOnlineUsers(users as string[])
    }, 1000)

    return () => clearInterval(interval)
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !user || isTyping) return

    setIsTyping(true)
    
    const message: Message = {
      id: `${Date.now()}-${Math.random()}`,
      username: user.username,
      content: newMessage.trim(),
      timestamp: Date.now(),
      userRole: 'Player'
    }

    const savedMessages = JSON.parse(localStorage.getItem('oranget_messages') || '[]')
    const updatedMessages = [...savedMessages, message]
    localStorage.setItem('oranget_messages', JSON.stringify(updatedMessages))
    setMessages(updatedMessages)

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
      case 'Admin': return '#ff4757'
      case 'Moderator': return '#3742fa'
      case 'Player': return '#ffffff'
      default: return '#ffffff'
    }
  }

  const handleUserClick = (username: string) => {
    setSelectedUser(username)
  }

  const addFriend = (username: string) => {
    toast({
      title: "Friend Request Sent!",
      description: `Friend request sent to ${username}`,
    })
    setSelectedUser(null)
  }

  const startTrade = (username: string) => {
    toast({
      title: "Trade Request Sent!",
      description: `Trade request sent to ${username}`,
    })
    setSelectedUser(null)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full blook-background">
        <AppSidebar />
        
        <main className="flex-1 relative z-10 p-6">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="blacket-button p-2" />
                <div>
                  <h1 className="text-4xl text-white font-bold drop-shadow-lg titan-light">
                    Chat
                  </h1>
                  <p className="text-orange-100 mt-1 font-medium titan-light">
                    Talk with other players
                  </p>
                </div>
              </div>
              <MessageCircle className="w-12 h-12 text-white" />
            </div>

            <div className="flex-1 flex gap-6 chat-container">
              {/* Chat Container */}
              <div className="flex-1 blacket-card flex flex-col">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-t-[17px] border-b-2 border-orange-400">
                  <h2 className="text-white font-bold titan-light text-xl">
                    Live Chat • {onlineUsers.length} online
                  </h2>
                </div>
                
                <div className="flex-1 flex flex-col">
                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto bg-orange-500/20 backdrop-blur-sm">
                    {messages.length === 0 ? (
                      <div className="text-center text-white/70 font-medium titan-light">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className="mb-4 flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-white/30">
                            <span className="text-white text-sm font-bold titan-light">
                              {message.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span 
                                className="font-bold titan-light text-sm cursor-pointer hover:underline"
                                style={{ color: getRoleColor(message.userRole) }}
                                onClick={() => handleUserClick(message.username)}
                              >
                                {message.username}
                              </span>
                              {message.userRole && (
                                <span className="text-xs px-2 py-1 rounded bg-white/20 text-white/80 titan-light">
                                  [{message.userRole}]
                                </span>
                              )}
                              <span className="text-xs text-white/60 titan-light">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="text-white titan-light bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-b-[17px] border-t-2 border-orange-400">
                    <div className="flex space-x-3">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-lg titan-light backdrop-blur-sm"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || isTyping}
                        className="blacket-button px-6"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Online Users */}
              <div className="w-80 blacket-card">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-t-[17px] border-b-2 border-orange-400">
                  <h3 className="text-white font-bold titan-light text-lg">Online Users</h3>
                </div>
                <div className="p-4 bg-orange-500/20 backdrop-blur-sm rounded-b-[17px] space-y-2 max-h-96 overflow-y-auto">
                  {onlineUsers.map((username, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                      onClick={() => handleUserClick(username)}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                        <span className="text-white titan-light text-sm">{username}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Action Modal */}
            {selectedUser && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="blacket-card p-6 m-4">
                  <h3 className="text-white text-xl font-bold titan-light mb-4">{selectedUser}</h3>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => addFriend(selectedUser)}
                      className="blacket-button flex items-center space-x-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add Friend</span>
                    </Button>
                    <Button
                      onClick={() => startTrade(selectedUser)}
                      className="blacket-button flex items-center space-x-2"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                      <span>Trade</span>
                    </Button>
                    <Button
                      onClick={() => setSelectedUser(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 titan-light"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
