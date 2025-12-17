import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const navigate = useNavigate()

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700">
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
              <SidebarTrigger className="hover:bg-orange-500 rounded-xl text-white" />
              <div>
                <h1 className="text-4xl text-white font-black drop-shadow-lg">Dashboard</h1>
                <p className="text-orange-100 mt-1 font-bold">Welcome to Oranget!</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              {/* Welcome Section */}
              <div className="text-center mb-12">
                <img 
                  src="/lovable-uploads/09e55504-38cb-49bf-9019-48c875713ca7.png"
                  alt="Oranget Logo"
                  className="w-32 h-32 mx-auto mb-6 rounded-lg border-4 border-orange-300 shadow-2xl animate-float"
                />
              <h2 className="text-5xl text-white font-black drop-shadow-lg mb-2">
                  Oranget
                </h2>
                <p className="text-2xl text-orange-100 font-bold drop-shadow-md">
                  Your Gaming Adventure Begins Here!
                </p>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-orange-600/80 backdrop-blur-sm border-4 border-orange-300 hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigate('/minigames')}>
                  <CardHeader>
                    <CardTitle className="text-2xl text-white font-black flex items-center gap-3">
                      <span className="text-3xl">🎮</span>
                      Mini Games
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-100 font-bold">Play exciting games and earn rewards!</p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-600/80 backdrop-blur-sm border-4 border-orange-300 hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigate('/marketplace')}>
                  <CardHeader>
                    <CardTitle className="text-2xl text-white font-black flex items-center gap-3">
                      <span className="text-3xl">🛒</span>
                      Marketplace
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-100 font-bold">Buy and sell items with other players!</p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-600/80 backdrop-blur-sm border-4 border-orange-300 hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigate('/community')}>
                  <CardHeader>
                    <CardTitle className="text-2xl text-white font-black flex items-center gap-3">
                      <span className="text-3xl">💬</span>
                      Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-100 font-bold">Connect with friends and the community!</p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-600/80 backdrop-blur-sm border-4 border-orange-300 hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigate('/blooks')}>
                  <CardHeader>
                    <CardTitle className="text-2xl text-white font-black flex items-center gap-3">
                      <span className="text-3xl">💎</span>
                      Blooks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-100 font-bold">Collect and manage your blook collection!</p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-600/80 backdrop-blur-sm border-4 border-orange-300 hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigate('/profile')}>
                  <CardHeader>
                    <CardTitle className="text-2xl text-white font-black flex items-center gap-3">
                      <span className="text-3xl">👤</span>
                      Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-100 font-bold">View your stats and achievements!</p>
                  </CardContent>
                </Card>

                <Card className="bg-orange-600/80 backdrop-blur-sm border-4 border-orange-300 hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigate('/exchange')}>
                  <CardHeader>
                    <CardTitle className="text-2xl text-white font-black flex items-center gap-3">
                      <span className="text-3xl">🔄</span>
                      Trading
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-100 font-bold">Trade items with other players!</p>
                  </CardContent>
                </Card>
              </div>

              {/* Get Started Section */}
              <div className="text-center">
                <Button 
                  onClick={() => navigate('/minigames')}
                  className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-500 text-white text-2xl font-black py-6 px-12 rounded-2xl h-auto border-4 border-orange-300 shadow-2xl hover:scale-105 transition-all duration-300 animate-pulse-orange"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}