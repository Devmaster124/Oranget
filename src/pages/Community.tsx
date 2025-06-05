
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
  blookPfp?: string
}

export default function Community() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatPollingRef = useRef<NodeJS.Timeout | null>(null)
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
      audioRef.current = new Audio('/ping.mp3') // You'll need to add this sound file
      
      // Load existing messages
      const savedMessages = JSON.parse(localStorage.getItem('oranget_messages') || '[]')
      setMessages(savedMessages)

      // Start real-time polling
      startRealTimeChat()
      updateOnlineStatus()

      return () => {
        if (chatPollingRef.current) {
          clearInterval(chatPollingRef.current)
        }
      }
    }
  }, [user])

  const startRealTimeChat = () => {
    // Poll for new messages every 500ms for real-time feel
    chatPollingRef.current = setInterval(() => {
      const savedMessages = JSON.parse(localStorage.getItem('oranget_messages') || '[]')
      
      // Check if there are new messages
      if (savedMessages.length > messages.length) {
        const newMessages = savedMessages.slice(messages.length)
        
        // Check for pings
        newMessages.forEach((msg: Message) => {
          if (msg.content.includes(`@${user?.username}`) && msg.username !== user?.username) {
            // Play ping sound
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.log('Could not play sound:', e))
            }
            
            // Show notification
            toast({
              title: "You've been pinged!",
              description: `${msg.username} mentioned you in chat`,
            })
          }
        })
        
        setMessages(savedMessages)
      }
    }, 500)
  }

  const updateOnlineStatus = () => {
    // Simulate online users - in a real app this would be handled by backend
    const users = ['Player1', 'Player2', 'Player3', user?.username].filter(Boolean)
    setOnlineUsers(users as string[])
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !user || isTyping) return

    setIsTyping(true)
    
    // Get user's current blook pfp from profile
    const userProfile = JSON.parse(localStorage.getItem(`oranget_profile_${user.id}`) || '{}')
    const userBlooks = JSON.parse(localStorage.getItem(`oranget_blooks_${user.id}`) || '[]')
    
    const message: Message = {
      id: `${Date.now()}-${Math.random()}`,
      username: user.username,
      content: newMessage.trim(),
      timestamp: Date.now(),
      userRole: 'Player',
      blookPfp: userProfile.selectedBlookPfp || (userBlooks[0]?.image) || '🧡'
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

  const formatMessageWithPings = (content: string) => {
    // Replace @username with highlighted mentions
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
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-orange-600 border-b-4 border-orange-400">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="blacket-button p-2" />
              <div>
                <h1 className="text-3xl text-white font-bold drop-shadow-lg titan-one-light">
                  Chat
                </h1>
                <p className="text-orange-100 mt-1 font-medium titan-one-light">
                  Talk with other players
                </p>
              </div>
            </div>
            <MessageCircle className="w-10 h-10 text-white" />
          </div>

          {/* Chat Container - Full Screen */}
          <div className="flex-1 blacket-card m-4 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-orange-500/20 backdrop-blur-sm">
              {messages.length === 0 ? (
                <div className="text-center text-white/70 font-medium titan-one-light">
                  No messages yet. Start the conversation! Use @username to ping someone.
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="mb-4 flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-white/30 cursor-pointer hover:scale-110 transition-transform">
                      <span className="text-2xl" title={`${message.username}'s Blook`}>
                        {message.blookPfp || '🧡'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span 
                          className="font-bold titan-one-light text-sm cursor-pointer hover:underline"
                          style={{ color: getRoleColor(message.userRole) }}
                          onClick={() => handleUserClick(message.username)}
                        >
                          {message.username}
                        </span>
                        {message.userRole && (
                          <span className="text-xs px-2 py-1 rounded bg-white/20 text-white/80 titan-one-light">
                            [{message.userRole}]
                          </span>
                        )}
                        <span className="text-xs text-white/60 titan-one-light">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-white titan-one-light bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        {formatMessageWithPings(message.content)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 border-t-2 border-orange-400">
              <div className="flex space-x-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... Use @username to ping someone"
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-lg titan-one-light backdrop-blur-sm"
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

          {/* User Action Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="blacket-card p-6 m-4">
                <h3 className="text-white text-xl font-bold titan-one-light mb-4">{selectedUser}</h3>
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
                    className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg px-4 py-2 titan-one-light"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  )
}
