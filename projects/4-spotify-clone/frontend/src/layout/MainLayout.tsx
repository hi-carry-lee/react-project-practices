import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      // 为什么用flex？因为 PlaybackControls 和 Resizable 是垂直布局
      className="h-screen bg-black text-white flex flex-col"
    >
      <ResizablePanelGroup
        direction="horizontal"
        // PlaybackControls占据固定高度，使用flex-1，让ResizablePanelGroup占据剩余空间
        // 不过经过测试，去掉flex-1 h-full overflow-hidden 后，效果相同
        // className="flex-1 h-full overflow-hidden p-2"
        className="p-2"
      >
        <AudioPlayer />
        {/* left sidebar */}
        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 0 : 10}
          maxSize={30}
        >
          <LeftSidebar />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/* Main content */}
        <ResizablePanel defaultSize={isMobile ? 80 : 60}>
          <Outlet />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

        {/* right sidebar */}
        <ResizablePanel
          defaultSize={20} // 初始占20%宽度
          minSize={0} // 最小可以缩到0%（隐藏）
          maxSize={25} // 最大只能占25%宽度
          collapsedSize={0} // 折叠时完全隐藏
        >
          <FriendsActivity />
        </ResizablePanel>
      </ResizablePanelGroup>
      <PlaybackControls />
    </div>
  );
};

export default MainLayout;
