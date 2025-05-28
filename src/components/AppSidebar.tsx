
import { Calendar, Home, Users, Dice6, Heart, ShoppingCart } from "lucide-react"
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
    title: "Profile",
    url: "/profile",
    icon: Home,
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
    title: "Casino",
    url: "/casino",
    icon: Dice6,
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
  return (
    <Sidebar className="border-r border-orange-600 font-fredoka bg-orange-500">
      <SidebarHeader className="border-b border-orange-600 p-4 bg-orange-600">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm relative">
            {/* Blook face */}
            <div className="w-2 h-2 bg-white rounded-full absolute top-2 left-2"></div>
            <div className="w-2 h-2 bg-white rounded-full absolute top-2 right-2"></div>
            <div className="w-0.5 h-0.5 bg-orange-800 rounded-full absolute top-2.5 left-2.5"></div>
            <div className="w-0.5 h-0.5 bg-orange-800 rounded-full absolute top-2.5 right-2.5"></div>
            <div className="w-3 h-1.5 bg-orange-800 rounded-full absolute bottom-2"></div>
          </div>
          <h1 className="font-fredoka text-2xl text-white font-bold">Oranget</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-orange-500">
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-100 font-fredoka font-bold text-lg px-4 py-3">Game Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="hover:bg-orange-600 hover:text-white data-[active=true]:bg-orange-600 data-[active=true]:text-white rounded-xl font-fredoka text-orange-100 text-lg py-6 px-4 h-auto"
                  >
                    <a href={item.url} className="flex items-center space-x-4">
                      <item.icon className="w-7 h-7" />
                      <span className="text-lg font-bold">{item.title}</span>
                    </a>
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
