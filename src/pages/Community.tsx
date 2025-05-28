
import { useState, useEffect, useRef } from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Users } from "lucide-react"
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onChildAdded, DatabaseReference } from 'firebase/database'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDV9tQXgzqxUayhvc384tTLOwy0QOEZVcU",
  authDomain: "chat-e6c93.firebaseapp.com",
  databaseURL: "https://chat-e6c93-default-rtdb.firebaseio.com",
  projectId: "chat-e6c93",
  storageBucket: "chat-e6c93.firebasestorage.app",
  messagingSenderId: "131547791719",
  appId: "1:131547791719:web:2f567033f028810345afc2",
  measurementId: "G-VY49LNJJLG"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

interface Message {
  id: string
  username: string
  text: string
  timestamp: number
}

export default function Community() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username] = useState('Player' + Math.floor(Math.random() * 1000))
  const [onlineUsers] = useState(Math.floor(Math.random() * 200) + 50)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<DatabaseReference>()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize Firebase chat reference
    chatRef.current = ref(database, 'oranget-chat/')
    
    // Listen for new messages
    const unsubscribe = onChildAdded(chatRef.current, (snapshot) => {
      const messageData = snapshot.val()
      if (messageData) {
        const message: Message = {
          id: snapshot.key || Date.now().toString(),
          username: messageData.username || 'Anonymous',
          text: messageData.text || '',
          timestamp: messageData.timestamp || Date.now()
        }
        
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          if (prev.some(msg => msg.id === message.id)) {
            return prev
          }
          return [...prev, message].slice(-50) // Keep last 50 messages
        })
      }
    })

    return () => {
      // Cleanup listener
      if (unsubscribe) {
        // onChildAdded returns a function to unsubscribe
      }
    }
  }, [])

  const sendMessage = async () => {
    if (newMessage.trim() && chatRef.current) {
      const messageData = {
        username,
        text: newMessage.trim(),
        timestamp: Date.now()
      }
      
      try {
        await push(chatRef.current, messageData)
        setNewMessage('')
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const escapeHtml = (text: string) => {
    const element = document.createElement('div')
    element.textContent = text
    return element.innerHTML
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
              
              <div className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-full">
                <Users className="w-5 h-5" />
                <span className="font-fredoka font-bold">{onlineUsers} Online</span>
              </div>
            </div>

            {/* Chat Interface */}
            <Card className="border-orange-200 bg-white/70 backdrop-blur-sm rounded-3xl border-2 h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-700 font-fredoka text-xl">Live Chat - Powered by Firebase</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-4">
                {/* Messages Area */}
                <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm relative flex-shrink-0">
                          {/* Blook face */}
                          <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2"></div>
                          <div className="w-2 h-2 bg-white rounded-full absolute top-2 right-2"></div>
                          <div className="w-0.5 h-0.5 bg-orange-800 rounded-full absolute top-2.5 left-2.5"></div>
                          <div className="w-0.5 h-0.5 bg-orange-800 rounded-full absolute top-2.5 right-2.5"></div>
                          <div className="w-3 h-1.5 bg-orange-800 rounded-full absolute bottom-2"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-fredoka font-bold text-orange-600">
                              {msg.username}
                            </span>
                            <span className="text-xs text-orange-400 font-fredoka">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="bg-orange-50 rounded-2xl px-4 py-2 border border-orange-200">
                            <p className="text-orange-800 font-fredoka" dangerouslySetInnerHTML={{ __html: escapeHtml(msg.text) }}></p>
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
                    placeholder="Type your message..."
                    className="flex-1 border-orange-200 focus:border-orange-400 rounded-full font-fredoka"
                    maxLength={500}
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
                  You're chatting as: <span className="font-bold text-orange-600">{username}</span> • Real-time chat powered by Firebase
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
