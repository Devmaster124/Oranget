
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, Calendar, Zap, Users, Gamepad2, ArrowLeftRight } from 'lucide-react'

const newsItems = [
  {
    id: 7,
    title: "Beta V1.1 + Music Settings",
    content:
      "Beta V1.1 is now shown on the Get Started page, background music can be toggled in Settings (and it saves), and the sidebar is back to the orange theme.",
    date: "2025-12-17",
    type: "Update",
    badge: "NEW",
  },
  {
    id: 8,
    title: "Live Chat Fix",
    content:
      "Chat now stays connected with a realtime listener and simplified avatars so it works reliably across users.",
    date: "2025-12-17",
    type: "Bug Fix",
    badge: "FIXED",
  },
  {
    id: 9,
    title: "1,000,000 Tokens For Everyone",
    content:
      "All accounts are now upgraded to 1,000,000 tokens automatically when you sign in (and new accounts start with 1,000,000).",
    date: "2025-12-17",
    type: "Economy",
    badge: "NEW",
  },
  {
    id: 1,
    title: "MEGA UPDATE: Trading & Friends System!",
    content:
      "We've just launched our biggest update yet! Now you can trade blooks with friends, send friend requests, and build your network in Oranget. The new Trading Hub lets you negotiate trades and manage your friendships all in one place.",
    date: "2025-06-04",
    type: "Major Update",
    badge: "NEW",
  },
  {
    id: 2,
    title: "Three New Mini Games Added!",
    content:
      "Get ready for more fun! We've added Pac-Man, Space Invaders, and Frogger to our mini games collection. Each game features classic gameplay with an orange twist. Challenge your friends and climb the leaderboards!",
    date: "2025-06-04",
    type: "Games",
    badge: "NEW",
  },
  {
    id: 3,
    title: "Real-Time Chat Improvements",
    content:
      "Chat is now truly real-time! We've fixed the double message issue and improved connection stability. Messages now appear instantly across all connected players. Stay connected with the Oranget community!",
    date: "2025-06-04",
    type: "Bug Fix",
    badge: "FIXED",
  },
  {
    id: 4,
    title: "UI Font Consistency Update",
    content:
      "We've standardized fonts across all pages for a more cohesive experience. The Titan One font is now used consistently throughout the application, making everything look cleaner and more professional.",
    date: "2025-06-04",
    type: "UI Improvement",
    badge: "IMPROVED",
  },
  {
    id: 5,
    title: "New Welcome Landing Page",
    content:
      "First impressions matter! We've created a stunning new welcome page that showcases Oranget's features before you even log in. Check it out and see what makes Oranget special!",
    date: "2025-06-04",
    type: "Feature",
    badge: "NEW",
  },
  {
    id: 6,
    title: "Enhanced Login Persistence",
    content:
      "No more accidental logouts! We've improved session management so you stay logged in even after refreshing the page. Your session will only end when you explicitly log out or after 24 hours.",
    date: "2025-06-04",
    type: "Security",
    badge: "IMPROVED",
  },
];

export default function News() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        <div className="falling-blooks"></div>
        
        <AppSidebar />
        
        <main className="flex-1 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-orange-600/80 backdrop-blur-sm border-b-4 border-orange-300">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-orange-700 rounded-xl text-white" />
              <div>
                <h1 className="text-4xl text-white font-bold drop-shadow-lg titan-one-light">Oranget News</h1>
                <p className="text-orange-100 mt-1 font-medium titan-one-light">Stay updated with the latest changes!</p>
              </div>
            </div>
            <Newspaper className="w-12 h-12 text-white" />
          </div>

          {/* News Items */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {newsItems.map((item) => (
                <Card key={item.id} className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl hover:scale-102 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl text-white font-bold mb-2 titan-one-light">
                          {item.title}
                        </CardTitle>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant="secondary" 
                            className={`font-bold titan-one-light ${
                              item.badge === 'NEW' ? 'bg-green-500 text-white' :
                              item.badge === 'FIXED' ? 'bg-blue-500 text-white' :
                              'bg-purple-500 text-white'
                            }`}
                          >
                            {item.badge}
                          </Badge>
                          <span className="text-orange-200 font-medium titan-one-light">{item.type}</span>
                          <div className="flex items-center text-orange-200 text-sm titan-one-light">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-4xl">
                        {item.type === 'Major Update' && <Zap className="w-8 h-8 text-yellow-300" />}
                        {item.type === 'Games' && <Gamepad2 className="w-8 h-8 text-blue-300" />}
                        {item.type === 'Bug Fix' && <Users className="w-8 h-8 text-green-300" />}
                        {item.type === 'Feature' && <ArrowLeftRight className="w-8 h-8 text-purple-300" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-100 text-lg leading-relaxed font-medium titan-one-light">
                      {item.content}
                    </p>
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
