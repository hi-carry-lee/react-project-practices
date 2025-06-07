import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, MessageCircle, Library } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className:
                  "w-full justify-start text-white hover:bg-zinc-800 hover:text-green-600",
              })
            )}
          >
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <SignedIn>
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className:
                    "w-full justify-start text-white hover:bg-zinc-800 hover:text-green-600",
                })
              )}
            >
              <MessageCircle className="mr-2 size-5" />
              <span className="hidden md:inline">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      <div className="flex-1 rounded-lg bg-zinc-900 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-white px-2">
            <Library className="size-5 mr-2" />
            <span className="hidden md:inline">Album Lists</span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                >
                  <img
                    src={album.imageUrl}
                    alt="Playlist img"
                    className="size-10 rounded-md flex-shrink-0 object-cover"
                  />

                  <div className="flex-1 min-w-0 hidden md:block">
                    <p className="font-medium truncate">{album.title}</p>
                    <p className="text-sm text-zinc-400 truncate">
                      Album • {album.artist}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;

/*
!组件设计说明
1. 当前组件是左侧栏，包含两个部分：
  1.1 上部导航栏，包含Home和Messages两个按钮
  1.2 下部的Playlists列表，包含多个专辑，其中library的含义是唱片的私人收藏

2. 上部的两个链接样式设计：需求是让 Link 看起来像一个 Button：
  2.1 手动实现，但是需要写大量的class样式；
  2.2 用Shadcn的Button包裹Link，可能会因为语义错误且可能有问题
  2.3 解决方案：Shadcn的设计思想是样式与功能分离，将样式逻辑提取为可复用的函数，Button组件自身也是用cn(buttonVariants())来定义样式的，所以在Link组件中使用 cn(buttonVariants()) 来定义类似Button的样式；
  2.4 cn(buttonVariants())作为Shadcn提供的独立函数，可以应用在任意html元素或者其他组件上；

3. 为什么使用 ScrollArea ？
  提供一致、可控、美观的滚动体验

4. 在后端使用seeds目录中的文件，预先创建测试数据；

5. 使用函数 fetchAlbums 作为useEffect的依赖项也是安全的
    5.1 正常情况下，zustand 确保在create内的函数都是稳定的；
    5.2 也可以通过添加注释：eslint-disable-next-line react-hooks/exhaustive-deps 来明确表示只在挂载时执行，从而忽略这个警告

*/
