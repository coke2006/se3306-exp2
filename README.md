# se3306-exp2 · 实验二：React 项目实战与 Zustand 状态管理

广东技术师范大学 · 24 软件工程 · 陈博（2024034743126）

从 0 手写 React 项目的一条完整主线：**组件 → 状态 → 持久化 → 全局状态 → 服务端状态 → 构建**。

## 仓库结构

```
se3306-exp2/
├── lab2-tic/      任务1 井字棋（官网教程：状态提升 + 时间旅行）
├── lab2-basics/   任务2 六个渐进训练 + 任务3 Thinking in React 四步法
├── lab2-blog/     任务4/5 博客主体（13 步 + Zustand + TanStack Query）
├── ai-review/     任务6 AI 生成代码的审查对象（原始草稿，未在项目中使用）
├── ai-review.md   任务6 五检查点审查记录（每条三件套）
├── AI使用声明.md   七、AI 使用规范要求的声明
└── tools/         截图脚本（无头 Chrome 真实操作页面后截图）
```

## 快速开始

```bash
# 任务1 井字棋
cd lab2-tic && pnpm install && pnpm dev      # http://localhost:5173

# 任务2/3 基础训练营
cd lab2-basics && pnpm install && pnpm dev

# 任务4/5 博客
cd lab2-blog && pnpm install
pnpm dev        # 博客本体 http://localhost:5173
pnpm mock       # 另开一个终端：json-server mock 后台 http://localhost:3000
```

## 博客的技术要点

| 主题 | 落地方式 |
|---|---|
| 状态三步演进 | `useState`（界面状态）→ `useLocalStorage`（表单草稿）→ `Zustand + persist`（文章数据） |
| Zustand | `create(persist(...))`，`partialize` 只持久化 posts；组件用 selector 精确订阅 |
| 服务端状态 | TanStack Query：`queryKey ["remote-posts", source]`，三态（骨架屏 / 错误 / 列表） |
| 乐观更新 | `useMutation` 四步：cancel → 快照并插入 → onError 回滚 → onSettled 重新拉取 |
| 数据层 | `api/client.js` 统一封装，`BASE_URL` 一改即接真实后台；mock 与真实后台同一套 `{code, message, data}` 信封 |
| 部署 | `pnpm build` 产静态 dist；线上数据源自动切内置 mock（`import.meta.env.PROD`） |

## 部署

- 仓库（Gitee）：https://gitee.com/coker-coal/se3306-exp2
- 部署链接：（构建后填写）
