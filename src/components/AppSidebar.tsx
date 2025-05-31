
import { Calendar, Home, Users, Gamepad, Heart, ShoppingCart, User } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Blooks",
    url: "/blooks",
    icon: Heart,
  },
  {
    title: "Marketplace",
    url: "/marketplace",
    icon: ShoppingCart,
  },
  {
    title: "Mini Games",
    url: "/games",
    icon: Gamepad,
  },
  {
    title: "Community",
    url: "/community",
    icon: Users,
  },
  {
    title: "Exchange Cart",
    url: "/exchange",
    icon: Calendar,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Sidebar className="border-r-4 border-orange-400 font-titan bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 shadow-2xl">
      <SidebarHeader className="border-b-4 border-orange-300 p-6 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/09e55504-38cb-49bf-9019-48c875713ca7.png"
            alt="Oranget Logo"
            className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
          />
          <div>
            <h1 className="font-titan text-3xl text-white font-black drop-shadow-lg tracking-wide">Oranget</h1>
            <p className="text-orange-100 text-sm font-bold opacity-90">Your Gaming World!</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-orange-500 to-orange-600 p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.url)}
                    className="hover:bg-orange-400 hover:text-white hover:scale-105 hover:shadow-lg data-[active=true]:bg-orange-400 data-[active=true]:text-white data-[active=true]:scale-105 data-[active=true]:shadow-lg rounded-2xl font-titan text-orange-100 text-lg py-4 px-4 h-auto transition-all duration-300 transform border-2 border-transparent hover:border-orange-200 group"
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
    </Sidebar>
  )
}
