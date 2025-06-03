
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, Calendar, User } from 'lucide-react'

const newsItems = [
  {
    id: 1,
    title: "New Mini Games Added!",
    content: "We've added 3 new exciting mini games including 3D Minecraft, Halo Arena, and Splitgate Portal!",
    date: "2024-06-03",
    author: "Oranget Team",
    category: "Games"
  },
  {
    id: 2,
    title: "Token Economy Update",
    content: "Starting tokens increased to 1000 for all new players! Earn more tokens by playing games.",
    date: "2024-06-02",
    author: "Admin",
    category: "Economy"
  },
  {
    id: 3,
    title: "Chat System Improvements",
    content: "Real-time chat is now available! Connect with players instantly.",
    date: "2024-06-01",
    author: "Development Team",
    category: "Features"
  },
  {
    id: 4,
    title: "Marketplace Launch",
    content: "The marketplace is now live! Trade items and blooks with other players.",
    date: "2024-05-31",
    author: "Oranget Team",
    category: "Trading"
  }
]

export default function News() {
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
        
        <main className="flex-1 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-orange-600/80 backdrop-blur-sm border-b-4 border-orange-300">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-orange-700 rounded-xl text-white" />
              <div>
                <h1 className="text-4xl text-white font-bold drop-shadow-lg">News & Updates</h1>
                <p className="text-orange-100 mt-1 font-medium">Stay up to date with Oranget!</p>
              </div>
            </div>
          </div>

          {/* News Content */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {newsItems.map((item) => (
                <Card key={item.id} className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl hover:scale-102 transition-transform">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-2xl text-white font-bold">{item.title}</CardTitle>
                      <Badge variant="secondary" className="font-medium">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-orange-100">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.author}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-100 font-medium leading-relaxed">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
