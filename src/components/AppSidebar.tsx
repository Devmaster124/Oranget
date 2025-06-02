import { Calendar, Home, Users, Heart, ShoppingCart, User, Music, Gamepad2, Settings, Newspaper, Trophy, Building, Briefcase } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Leaderboard",
    url: "/leaderboard", 
    icon: Trophy,
  },
  {
    title: "Chat",
    url: "/community",
    icon: Users,
  },
  {
    title: "Market",
    url: "/marketplace",
    icon: ShoppingCart,
  },
  {
    title: "Auction",
    url: "/auction",
    icon: Building,
  },
  {
    title: "Blooks",
    url: "/blooks",
    icon: Briefcase,
  },
  {
    title: "Minigames",
    url: "/minigames",
    icon: Gamepad2,
  },
]

const bottomItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "News",
    url: "/news",
    icon: Newspaper,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <Sidebar className="border-none bg-transparent">
      <div className="bg-orange-500/95 backdrop-blur-sm h-full border-r-4 border-orange-300 shadow-2xl">
        <SidebarHeader className="border-b-4 border-orange-300 p-6 bg-orange-600/80">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/09e55504-38cb-49bf-9019-48c875713ca7.png"
              alt="Oranget Logo"
              className="w-12 h-12 rounded-lg border-4 border-white shadow-lg animate-pulse-orange"
            />
            <div>
              <h1 className="text-3xl text-white font-black drop-shadow-lg tracking-wide font-titan">Oranget</h1>
              <p className="text-orange-100 text-sm font-bold opacity-90 font-titan">Your Gaming World!</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="bg-orange-500/95 p-2 flex-1">
          <SidebarGroup className="flex-1">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => navigate(item.url)}
                      className="hover:bg-orange-400 hover:text-white hover:scale-105 hover:shadow-lg data-[active=true]:bg-orange-400 data-[active=true]:text-white data-[active=true]:scale-105 data-[active=true]:shadow-lg rounded-2xl text-orange-100 text-lg py-4 px-4 h-auto transition-all duration-300 transform border-2 border-transparent hover:border-orange-200 group font-titan"
                      data-active={location.pathname === item.url}
                    >
                      <item.icon className="w-7 h-7 group-hover:animate-bounce" />
                      <span className="text-lg font-black drop-shadow-sm">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 bg-orange-600/80 border-t-4 border-orange-300">
          <SidebarMenu className="space-y-2">
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  onClick={() => navigate(item.url)}
                  className="hover:bg-orange-400 hover:text-white rounded-2xl text-orange-100 text-base py-3 px-3 h-auto transition-all duration-300 border-2 border-transparent hover:border-orange-200 font-titan"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-base font-bold">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full text-orange-100 border-orange-300 hover:bg-orange-400 hover:text-white rounded-2xl text-base py-3 h-auto font-titan font-bold transition-all duration-300"
              >
                Logout
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}