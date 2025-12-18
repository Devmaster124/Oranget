
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Music, LogOut } from "lucide-react";
import { useLocalStorageBoolean } from "@/hooks/useLocalStorage";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const [musicEnabled, setMusicEnabled] = useLocalStorageBoolean(
    "oranget_music_enabled",
    true
  );
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
          <div
            className="w-full h-full opacity-30"
            style={{
              backgroundImage: 'url("https://i.ibb.co/S4BD0J48/download.png")',
              animation: "animatedBackground 9s linear infinite",
            }}
          />
        </div>

        <AppSidebar />

        <main className="flex-1 relative z-10">
          <header className="flex items-center justify-between p-6 bg-orange-600/80 backdrop-blur-sm border-b-4 border-orange-300">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-orange-700 rounded-xl text-white" />
              <div>
                <h1 className="text-4xl text-white font-bold drop-shadow-lg titan-one-light">
                  Settings
                </h1>
                <p className="text-orange-100 mt-1 font-medium titan-one-light">
                  Customize your experience!
                </p>
              </div>
            </div>
          </header>

          <main className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="bg-orange-500/80 backdrop-blur-sm border-4 border-orange-300 rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-white font-bold flex items-center titan-one-light">
                    <Music className="w-8 h-8 mr-3" />
                    Music
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium titan-one-light">
                      Background Music
                    </span>
                    <Switch
                      checked={musicEnabled}
                      onCheckedChange={setMusicEnabled}
                    />
                  </div>
                </CardContent>
              </Card>

              {user && (
                <Card className="bg-red-500/80 backdrop-blur-sm border-4 border-red-300 rounded-3xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white font-bold flex items-center titan-one-light">
                      <LogOut className="w-8 h-8 mr-3" />
                      Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleSignOut}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl titan-one-light"
                    >
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </main>
      </div>
    </SidebarProvider>
  );
}
