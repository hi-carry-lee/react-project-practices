# MERN Stack Project: Build and Deploy a Twitter Clone From Scratch | JWT, Socket.io

![Demo App](https://i.ibb.co/f8y9vGS/Group-82.png)

Some Features:

- ⚛️ Tech Stack: React.js, MongoDB, Node.js, Express, Tailwind
- 🔐 Authentication with JSONWEBTOKENS (JWT)
- 🔥 React Query for Data Fetching, Caching etc.
- 👥 Suggested Users to Follow
- ✍️ Creating Posts
- 🗑️ Deleting Posts
- 💬 Commenting on Posts
- ❤️ Liking Posts
- 🔒 Delete Posts (if you are the owner)
- 📝 Edit Profile Info
- 🖼️ Edit Cover Image and Profile Image
- 📷 Image Uploads using Cloudinary
- 🔔 Send Notifications
- 🌐 Deployment
- ⏳ And much more!

### Setup .env file

```js
MONGO_URI=...
PORT=...
JWT_SECRET=...
NODE_ENV=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

# 关于 like/unlike 的设计方案

## 核心原则

大型社交媒体平台（Twitter、微博）**绝不采用直接数据库更新**，而是使用**分层缓存 + 异步同步**的混合架构。

## 三层架构设计

### 第一层：前端优化层

- **立即响应**：用户点击后立即更新 UI 显示，提供即时反馈
- **防抖处理**：避免用户重复点击造成的多次请求
- **状态回滚**：请求失败时自动恢复 UI 到之前状态
- **用户体验**：确保操作流畅，无卡顿感

### 第二层：缓存存储层

- **Redis Hash 存储**：存储帖子点赞数和用户点赞关系
- **Redis Set 存储**：维护用户点赞帖子列表，便于快速查询
- **原子操作**：使用 Redis Pipeline 确保数据操作的原子性
- **高性能访问**：毫秒级响应，支持高并发读写

### 第三层：异步同步层

- **准实时同步**：关键数据（点赞数）每 30 秒-5 分钟同步到数据库
- **批量同步**：用户点赞关系等非关键数据每小时批量处理
- **兜底全量同步**：每日凌晨进行全量数据校验和修复
- **消息队列**：通过异步消息确保数据最终一致性

## 架构优势

### 性能提升

- **响应时间**：从几百毫秒降至几十毫秒
- **吞吐量**：提升 100-1000 倍处理能力
- **数据库压力**：减少 90%以上的直接写操作

### 可靠性保障

- **最终一致性**：接受短时间数据不一致，保证最终同步
- **补偿机制**：定期对比缓存和数据库，自动修复数据差异
- **容错设计**：多级降级策略，确保服务高可用

## 方案对比

| 架构方案     | 优势               | 劣势                 | 适用场景                  |
| ------------ | ------------------ | -------------------- | ------------------------- |
| 直接数据库   | 强一致性、实现简单 | 性能差、扩展性差     | 小型应用（<1 万用户）     |
| 纯缓存       | 性能极佳、响应快   | 数据易丢失、可靠性差 | 对一致性要求不高的场景    |
| 三层混合架构 | 平衡性能与可靠性   | 实现复杂度高         | 大型社交平台（>百万用户） |

## 实施建议

1. **小型项目**：从简单的直接数据库方案开始
2. **成长期项目**：当并发达到瓶颈时引入缓存层
3. **大型项目**：从设计阶段就采用三层架构，为未来扩展做准备
4. **核心思想**：用空间换时间，用复杂度换性能，渐进式演进
