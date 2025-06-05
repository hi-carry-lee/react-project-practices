import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useMemo } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {
  const {
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
    isLoading,
    madeForYouSongs,
    featuredSongs,
    trendingSongs,
  } = useMusicStore();

  const { initializeQueue } = usePlayerStore();

  useEffect(() => {
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  useEffect(() => {
    if (
      madeForYouSongs.length > 0 &&
      featuredSongs.length > 0 &&
      trendingSongs.length > 0
    ) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

  // useMemo:只会在组件首次渲染时执行一次，不会在每次重新渲染时都重新计算
  const getGreeting = useMemo(() => {
    // 使用 Intl.DateTimeFormat 获取用户本地时区的时间，以满足国际化需求
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    const hour = parseInt(formatter.format(new Date()));

    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 18) return "Good afternoon";
    if (hour >= 18 && hour < 22) return "Good evening";
    return "Good night";
  }, []);

  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <Topbar />
      <ScrollArea
        // 固定滚动区域高度，为最下方的播放区域预留空间
        className="h-[calc(100vh-180px)]"
      >
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">{getGreeting}</h1>
          <FeaturedSection />

          <div className="space-y-8">
            <SectionGrid
              title="Made For You"
              songs={madeForYouSongs}
              isLoading={isLoading}
            />
            <SectionGrid
              title="Trending"
              songs={trendingSongs}
              isLoading={isLoading}
            />
          </div>
        </div>
      </ScrollArea>
    </main>
  );
};
export default HomePage;
