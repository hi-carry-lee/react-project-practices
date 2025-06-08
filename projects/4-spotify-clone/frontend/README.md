# 功能及实现方案

# 播放器

1. 实现播放器的两种方式：通过 audio 元素手动实现，使用三方库，这里使用的是手动实现
2. 全局只有一个 audio 元素，在没有指定 control 属性时，该元素不可见，我们也需要它可见；
3. 创建 AudioPlayer 组件，通过 useRef 获取 audio 元素，通过 useEffect 为 audio 元素绑定控制事件；
4. 使用 zustand 创建 usePlayerStore ，在这里实现播放相关的逻辑；
5. PlaybackControls 组件，用来实现播放控制按钮
   通过 document.querySelector 获取 audio 元素，然后可以控制 audio 元素的属性（比如播放时间等等）；

# websocket 通信

1. 前端

   1. 创建 socket 连接
   2. 监听事件
   3. 发送事件

2. 后端
   1. 需要作 token 认证
   2. 创建 socket 连接，将该 socket 连接和用户 id 绑定存储；
   3. 监听事件、单独发送事件、群发事件；

# 用 Icon 代替 input

1. 创建 input 元素，添加 hidden 属性；
2. 创建一个 ref，关联到该 input 元素中
3. 添加一个 ICON 组件，为它绑定点击事件，点击时，通过 ref 来为隐藏的 input 元素赋值

# 布局

1. 使用 Shadcn 的 Resizable 实现动态弹性布局：所划分的模块，都可以动态调整尺寸；

#
