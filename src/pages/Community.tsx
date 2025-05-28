
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Users } from "lucide-react"

interface Message {
  id: string
  username: string
  message: string
  timestamp: Date
  color: string
}

export default function Community() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      username: 'OrangeKing',
      message: 'Hey everyone! Just got a legendary blook!',
      timestamp: new Date(Date.now() - 300000),
      color: 'text-orange-600'
    },
    {
      id: '2',
      username: 'BlookMaster',
      message: 'Nice! Which one did you get?',
      timestamp: new Date(Date.now() - 240000),
      color: 'text-orange-700'
    },
    {
      id: '3',
      username: 'CitrusCollector',
      message: 'Trading rare blooks for tokens! DM me',
      timestamp: new Date(Date.now() - 180000),
      color: 'text-orange-800'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [username] = useState('Player' + Math.floor(Math.random() * 1000))
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Simulate real-time messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        'Anyone want to trade?',
        'Just won big at the casino!',
        'Looking for rare blooks',
        'This game is amazing!',
        'New player here, any tips?',
        'Check out my collection!',
        'Who wants to play?',
        'Trading event starting soon!'
      ]
      
      const randomUsernames = [
        'BlookHunter', 'OrangeEnthusiast', 'GamerPro', 'CollectorX', 
        'CasinoKing', 'TradeMaster', 'BlookFan', 'OrangeJuice'
      ]
      
      if (Math.random() < 0.3) { // 30% chance every 5 seconds
        const newMsg: Message = {
          id: Date.now().toString(),
          username: randomUsernames[Math.floor(Math.random() * randomUsernames.length)],
          message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          timestamp: new Date(),
          color: `text-orange-${Math.floor(Math.random() * 3) + 6}00`
        }
        setMessages(prev => [...prev.slice(-19), newMsg]) // Keep last 20 messages
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        username,
        message: newMessage,
        timestamp: new Date(),
        color: 'text-orange-600'
      }
      setMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
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
                  <p className="text-orange-500 mt-1 font-fredoka">Connect with other players!</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full">
                <Users className="w-5 h-5" />
                <span className="font-fredoka font-bold">127 Online</span>
              </div>
            </div>

            {/* Chat Interface */}
            <Card className="border-orange-200 bg-white/70 backdrop-blur-sm rounded-3xl border-2 h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-700 font-fredoka text-xl">Global Chat</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-4">
                {/* Messages Area */}
                <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollAreaRef}>
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-fredoka font-bold ${msg.color}`}>
                            {msg.username}
                          </span>
                          <span className="text-xs text-orange-400 font-fredoka">
                            {msg.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="bg-orange-50 rounded-2xl px-4 py-2 ml-4 border border-orange-200">
                          <p className="text-orange-800 font-fredoka">{msg.message}</p>
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
                    placeholder="Type your message..."
                    className="flex-1 border-orange-200 focus:border-orange-400 rounded-full font-fredoka"
                  />
                  <Button
                    onClick={sendMessage}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 font-fredoka"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-orange-400 mt-2 text-center font-fredoka">
                  You're chatting as: <span className="font-bold text-orange-600">{username}</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
