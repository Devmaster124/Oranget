import { Home, MessageSquare, Users, Trophy, ShoppingCart, Settings, Gamepad2, Newspaper } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/community",
    icon: MessageSquare,
  },
  {
    title: "Marketplace",
    url: "/marketplace", 
    icon: ShoppingCart,
  },
  {
    title: "Blooks",
    url: "/blooks",
    icon: Trophy,
  },
  {
    title: "Guilds",
    url: "/teams",
    icon: Users,
  },
  {
    title: "Games",
    url: "/minigames",
    icon: Gamepad2,
  },
  {
    title: "News",
    url: "/news",
    icon: Newspaper,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="bg-sidebar backdrop-blur-md border-r-4 border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary-foreground font-bold text-lg titan-one-light px-2 py-3">
            🧡 OrangeT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={`text-primary-foreground hover:bg-primary/70 rounded-xl transition-colors py-1 px-2 h-7 text-xs ${
                        isActive ? 'bg-primary/80 font-bold' : ''
                      }`}
                    >
                      <Link to={item.url} className="flex items-center space-x-2">
                        <item.icon className="w-3 h-3" />
                        <span className="titan-one-light">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}