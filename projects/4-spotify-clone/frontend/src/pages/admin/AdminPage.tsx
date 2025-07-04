import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();

  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
    fetchStats();
  }, [fetchAlbums, fetchSongs, fetchStats]);

  if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

  return (
    <div
      // 默认min-h-screen，因为小屏幕尺寸下，需要不固定内容高度，否则会因为DashboardStats变成垂直，而导致song list 看不到了
      className="min-h-screen md:h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8 flex flex-col"
    >
      <Header />

      <DashboardStats />

      <Tabs defaultValue="songs" className="flex flex-col space-y-6 min-h-0">
        <TabsList className="p-1 bg-zinc-800/50 w-fit">
          <TabsTrigger
            value="songs"
            className="data-[state=active]:bg-zinc-700"
          >
            <Music className="mr-2 size-4" />
            Songs
          </TabsTrigger>
          <TabsTrigger
            value="albums"
            className="data-[state=active]:bg-zinc-700"
          >
            <Album className="mr-2 size-4" />
            Albums
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="flex-1 min-h-0">
          <SongsTabContent />
        </TabsContent>
        <TabsContent value="albums" className="flex-1 min-h-0">
          <AlbumsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AdminPage;
