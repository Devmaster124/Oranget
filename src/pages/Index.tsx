
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { BlookCard } from "@/components/BlookCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const sampleBlooks = [
  { name: "Orange Blob", rarity: "uncommon" as const, owned: 3 },
  { name: "Citrus Cat", rarity: "rare" as const, owned: 1 },
  { name: "Flame Dragon", rarity: "epic" as const, owned: 0 },
  { name: "Golden Phoenix", rarity: "legendary" as const, owned: 1 },
  { name: "Prismatic Tiger", rarity: "chroma" as const, owned: 0 },
  { name: "Rainbow Unicorn", rarity: "mythical" as const, owned: 0 },
]

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 to-orange-100">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="hover:bg-orange-100" />
                <div>
                  <h1 className="text-4xl font-fredoka text-orange-600">Welcome to Oranget!</h1>
                  <p className="text-orange-500 mt-1">Collect, evolve, and trade amazing blooks</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                  Tokens: 1,250
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                  Blooks: 24/100
                </Badge>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-orange-200 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-700 font-fredoka">Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">24</div>
                  <p className="text-orange-500 text-sm">Total Blooks Owned</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-700 font-fredoka">Casino Wins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">12</div>
                  <p className="text-orange-500 text-sm">Total Victories</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-700 font-fredoka">Market Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">5,670</div>
                  <p className="text-orange-500 text-sm">Total Collection Worth</p>
                </CardContent>
              </Card>
            </div>

            {/* Featured Blooks */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-fredoka text-orange-700">Your Recent Blooks</h2>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  View All Blooks
                </Button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {sampleBlooks.map((blook, index) => (
                  <BlookCard
                    key={index}
                    name={blook.name}
                    rarity={blook.rarity}
                    owned={blook.owned}
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-orange-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-fredoka text-xl">🎰</span>
                  </div>
                  <h3 className="font-fredoka text-orange-700 mb-1">Casino</h3>
                  <p className="text-orange-500 text-sm">Try your luck!</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-fredoka text-xl">🛒</span>
                  </div>
                  <h3 className="font-fredoka text-orange-700 mb-1">Marketplace</h3>
                  <p className="text-orange-500 text-sm">Buy & sell blooks</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-fredoka text-xl">💬</span>
                  </div>
                  <h3 className="font-fredoka text-orange-700 mb-1">Community</h3>
                  <p className="text-orange-500 text-sm">Chat with players</p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white font-fredoka text-xl">🔄</span>
                  </div>
                  <h3 className="font-fredoka text-orange-700 mb-1">Exchange</h3>
                  <p className="text-orange-500 text-sm">Trade with others</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
