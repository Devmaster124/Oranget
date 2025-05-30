
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ExchangeCart() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 via-orange-100 to-yellow-50 font-fredoka">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-100 rounded-xl" />
                <div>
                  <h1 className="text-4xl font-fredoka text-orange-600 font-black drop-shadow-lg">
                    🔄 Exchange Cart
                  </h1>
                  <p className="text-orange-500 mt-1 font-bold">Trade blooks with other players!</p>
                </div>
              </div>
            </div>

            {/* Coming Soon Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-4 border-orange-200 rounded-3xl shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-orange-600 font-black">Coming Soon! 🚀</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-6xl">🔄</span>
                </div>
                <p className="text-orange-500 text-xl font-bold mb-4">
                  The Exchange Cart is under development!
                </p>
                <p className="text-orange-400 font-bold">
                  Soon you'll be able to trade blooks, create exchange offers, and negotiate with other players.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
