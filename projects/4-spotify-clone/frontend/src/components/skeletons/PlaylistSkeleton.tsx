const PlaylistSkeleton = () => {
  return Array.from({ length: 7 }).map((_, i) => (
    <div key={i} className="p-2 rounded-md flex items-center gap-3">
      <div className="w-12 h-12 bg-zinc-800 rounded-md flex-shrink-0 animate-pulse" />
      <div className="flex-1 min-w-0 hidden md:block space-y-2">
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-zinc-800 rounded animate-pulse w-1/2" />
      </div>
    </div>
  ));
};
export default PlaylistSkeleton;

/*
组件设计说明
1. 当前组件是左侧栏的Playlists列表的骨架屏，用来在数据加载完成前，给用户一个友好的提示
2. animate-pulse是TailWind CSS的预定义动画类，实现脉搏式闪烁效果，给用户暗示：内容正在加载中
*/
