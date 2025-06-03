
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Settings as SettingsIcon, Volume2, Bell, Shield } from 'lucide-react'

export default function Settings() {
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
                <h1 className="text-4xl text-white font-bold drop-shadow-lg">Settings</h1>
                <p className="text-orange-100 mt-1 font-medium">Customize your experience!</p>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold flex items-center">
                    <Volume2 className="w-8 h-8 mr-3" />
                    Audio Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Master Volume</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Sound Effects</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Background Music</span>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold flex items-center">
                    <Bell className="w-8 h-8 mr-3" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Push Notifications</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Trade Requests</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Friend Requests</span>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold flex items-center">
                    <Shield className="w-8 h-8 mr-3" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Private Profile</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Show Online Status</span>
                    <Switch />
                  </div>
                  <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold rounded-2xl py-3">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
