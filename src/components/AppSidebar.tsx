
import { Calendar, Home, Users, Heart, ShoppingCart, User, Gamepad2, Settings, Newspaper, Trophy, Building, Briefcase, ArrowLeftRight } from "lucide-react"
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
    title: "Profile",
    url: "/profile",
    icon: User,
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
    title: "Trading",
    url: "/trading",
    icon: ArrowLeftRight,
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
    navigate('/')
  }

  return (
    <Sidebar className="border-none bg-transparent">
      <div className="blook-background h-full border-r-4 border-orange-400 shadow-2xl">
        <SidebarHeader className="border-b-4 border-orange-400 p-6 bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
              <span className="text-2xl">🧡</span>
            </div>
            <div>
              <h1 className="text-3xl text-white font-bold drop-shadow-lg tracking-wide titan-light">Oranget</h1>
              <p className="text-orange-100 text-sm font-medium opacity-90 titan-light">Your Gaming World!</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="bg-gradient-to-b from-orange-500/95 to-orange-600/95 p-3 flex-1">
          <SidebarGroup className="flex-1">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => navigate(item.url)}
                      className={`blacket-button h-14 px-4 text-lg titan-light ${
                        location.pathname === item.url 
                          ? 'bg-orange-400 border-orange-300 shadow-lg scale-105' 
                          : 'hover:bg-orange-400 hover:scale-105'
                      } transition-all duration-300`}
                    >
                      <item.icon className="w-6 h-6" />
                      <span className="text-lg titan-light">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 bg-gradient-to-r from-orange-600 to-orange-700 border-t-4 border-orange-400">
          <SidebarMenu className="space-y-2">
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  onClick={() => navigate(item.url)}
                  className="blacket-button h-12 px-3 text-base titan-light hover:bg-orange-400"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-base titan-light">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <Button
                onClick={handleSignOut}
                className="blacket-button w-full h-12 text-base titan-light bg-red-500 border-red-400 hover:bg-red-600"
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
