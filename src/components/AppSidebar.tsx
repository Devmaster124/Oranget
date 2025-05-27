
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
    <Sidebar className="border-r border-orange-200 font-fredoka">
      <SidebarHeader className="border-b border-orange-200 p-4">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/09e55504-38cb-49bf-9019-48c875713ca7.png" 
            alt="Oranget Logo" 
            className="w-8 h-8 object-contain"
          />
          <h1 className="font-fredoka text-xl text-orange-600">Oranget</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-700 font-fredoka font-bold">Game Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="hover:bg-orange-50 hover:text-orange-700 data-[active=true]:bg-orange-100 data-[active=true]:text-orange-800 rounded-xl font-fredoka"
                  >
                    <a href={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
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
