import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext } = usePlayerStore();

  // 1️⃣ handle play/pause
  // 根据 usePlayerStore 中的播放状态，控制 audioRef.current 的播放/暂停
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // 2️⃣ handle song ends
  // 监听 audioRef.current 的 ended 事件，播放下一首
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      playNext();
    };
    audio?.addEventListener("ended", handleEnded);

    return () => audio?.removeEventListener("ended", handleEnded);
  }, [playNext]);

  // 3️⃣ handle song changes
  // 监听 currentSong 的变化，如果当前歌曲发生变化，则播放新的歌曲
  useEffect(() => {
    const audio = audioRef.current;
    // 防御性编程: audio元素已挂载 + 有歌曲要播放
    if (!audio || !currentSong) return;

    // 通过上一首歌曲URL，当前歌曲URL，判断是否真的需要切换歌曲
    // 它的必要性：因为我们希望，播放/暂停时不应该重新加载音频文件
    const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
    if (isSongChange) {
      audio.src = currentSong?.audioUrl; // 设置新的音频源
      // reset the playback position
      audio.currentTime = 0; // 重置播放进度到开头
      prevSongRef.current = currentSong?.audioUrl; // 更新记录
      if (isPlaying) audio.play(); // 如果当前是播放状态，自动播放新歌
    }
  }, [currentSong, isPlaying]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;

/*
1. audioRef.current 指向的是 <audio> 元素的实际DOM节点;
    1.1. HTML的 <audio> 元素默认情况下不显示任何可视化界面，它只是一个"幕后"的音频播放器。
    1.2. 如果你想看到播放器控件，可以添加 controls 属性；
    1.3. 通常这种"无界面"的AudioPlayer，需要配合一个自定义的播放器UI组件使用
    1.4. 现代Web开发，普遍采用这种逻辑与UI分离的模式：
        整个应用只维护一个audio元素实例
        播放引擎层：PlaybackControls组件，纯逻辑，处理音频播放、状态管理、队列控制
        状态管理层：usePlayerStore，全局Store，管理播放状态、歌曲列表、用户偏好
        UI表现层：各种播放器界面，从引擎层获取数据并发送指令

2. 当前组件的设计思路：
    虽然 audio 元素在页面上不展示，但是通过 useEffect 为它添加各种事件监听，
    把真正实现控制的逻辑放在 usePlayerStore 中，
    其他页面组件，只需要从 usePlayerStore 中获取控制的方法，实现歌曲播放的控制，进而改变状态；
    在useEffect中根据状态，控制 audio 元素的播放/暂停、播放下一首等操作；

3. HTMLAudioElement 继承自 HTMLMediaElement，这个类提供了音视频播放的标准API方法:
    audioRef.current.play()     // 播放
    audioRef.current.pause()    // 暂停  
    audioRef.current.load()     // 重新加载
    audioRef.current.canPlayType('audio/mp3') // 检查格式支持
  HTMLAudioElement 的常用属性
    audioRef.current.src = 'music.mp3' 设置音频源
    audioRef.current.currentTime = 30  设置播放进度(秒)
    audioRef.current.volume = 0.5      设置音量(0-1)
    audioRef.current.duration          音频总长度
    audioRef.current.paused            是否暂停状态

4. HTMLAudioElement 支持多种媒体事件
    audio.addEventListener('ended', handler) 播放结束
    audio.addEventListener('play', handler)  开始播放
    audio.addEventListener('pause', handler) 暂停播放
    audio.addEventListener('loadstart', handler)  开始加载
    audio.addEventListener('loadeddata', handler) 数据加载完成
    audio.addEventListener('canplay', handler)  可以播放
    audio.addEventListener('timeupdate', handler) 播放进度更新
    audio.addEventListener('error', handler) 播放错误

*/
