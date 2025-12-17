import {
  Home,
  MessageSquare,
  ShoppingCart,
  Trophy,
  Gamepad2,
  Newspaper,
  Settings,
  Play,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Chat",
    url: "/community",
    icon: MessageSquare,
  },
  {
    title: "Blooks",
    url: "/blooks",
    icon: Trophy,
  },
  {
    title: "Market",
    url: "/marketplace",
    icon: ShoppingCart,
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
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar className="bg-sidebar text-sidebar-foreground border-sidebar-border w-48">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup className="p-0">
          {/* Logo */}
          <div className="px-4 pt-4 pb-2">
            <h1 className="text-2xl font-black tracking-tight">Oranget</h1>
          </div>

          {/* Play Button */}
          <div className="px-3 py-2">
            <Button
              onClick={() => navigate("/minigames")}
              className="w-full blacket-button text-lg py-3 rounded-lg shadow-md flex items-center justify-center gap-2 h-12"
            >
              <Play className="w-5 h-5" />
              Play
            </Button>
          </div>

          {/* Stats Button */}
          <div className="px-3 py-1">
            <Button
              onClick={() => navigate("/profile")}
              variant="secondary"
              className="w-full text-sm py-2 rounded-lg flex items-center justify-center gap-2 h-9"
            >
              <span className="text-xs">📊</span>
              Stats
            </Button>
          </div>

          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="px-2 space-y-0.5">
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`rounded-lg transition-colors py-2 px-3 h-10 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
                          : "bg-transparent"
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

