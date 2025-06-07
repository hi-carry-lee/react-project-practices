# Token 认证机制优化

## 问题背景

原来的 token 认证机制在某些情况下会出现认证失败，主要原因是：

1. **竞态条件**：快速点击或并发请求时，可能获取到不同状态的 token
2. **静态设置**：在应用启动时一次性设置 token 到 axios headers
3. **缺乏刷新机制**：没有自动处理 token 过期的重试逻辑

## 解决方案

采用 **Axios 请求拦截器** 方案，核心改进：

### 1. 动态 Token 获取

- 每个请求都动态获取最新的 token
- 利用 Clerk 的智能缓存机制（60 秒内返回缓存 token）
- 避免了竞态条件问题

### 2. 自动重试机制

- 当收到 401 错误时，自动重新获取 token 并重试请求
- 避免无限重试的死循环
- 优雅处理 token 过期情况

## 修改内容

### 📁 `/src/lib/axios.ts`

- ➕ 添加了全局 token 获取函数管理
- ➕ 实现了请求拦截器（动态设置 Authorization 头）
- ➕ 实现了响应拦截器（处理 401 错误和自动重试）
- ➕ 添加了调试函数 `testTokenGetter`

### 📁 `/src/providers/AuthProvider.tsx`

- ➖ 移除了 `updateApiToken` 函数和手动 token 设置
- ➕ 使用 `setTokenGetter` 将 Clerk 的 `getToken` 传递给 axios
- 🔄 简化了初始化逻辑

## 性能说明

- **几乎无性能损失**：利用 Clerk 原生缓存，大部分情况下 token 获取是瞬时的
- **减少网络请求**：只有在 token 过期时才会发起新的请求
- **更好的用户体验**：自动处理 token 刷新，用户无感知

## 使用方法

### 开发调试

在浏览器控制台中可以使用以下命令测试 token 获取：

```javascript
// 测试token是否正常获取
window.testClerkToken();
```

### API 请求

无需修改现有的 API 请求代码，拦截器会自动处理 token：

```typescript
// 原来的代码无需修改，拦截器会自动添加token
const response = await axiosInstance.get("/songs");
```

## 向后兼容性

✅ **完全向后兼容** - 现有的 API 调用代码无需修改

## 注意事项

1. **确保 AuthProvider 挂载**：只有在 AuthProvider 组件挂载后，token 获取函数才会被设置
2. **错误处理**：如果 token 获取失败，请求会继续进行（但可能会收到 401 错误）
3. **调试功能**：`testTokenGetter` 函数只在开发环境中可用

## 测试建议

1. 快速点击多个需要认证的页面链接
2. 在 Network 面板中观察 Authorization 头是否正确设置
3. 模拟 token 过期情况，验证自动重试是否正常工作
