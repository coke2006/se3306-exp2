import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_POSTS } from "../api/mock";

// 任务5：把任务4 里 App 的 posts state + useLocalStorage 一起升级成全局 store
// 组件不再层层传 props，谁用谁取；persist 负责写 localStorage
export const usePostStore = create(
  persist(
    (set) => ({
      posts: SEED_POSTS,

      // 发布：新文章插到最前面，用新数组
      publish: (draft) =>
        set((state) => ({
          posts: [
            {
              ...draft,
              id: `p-${Date.now()}`,
              publishedAt: new Date().toISOString().slice(0, 10),
            },
            ...state.posts,
          ],
        })),

      // 编辑：map 出新数组，只替换目标那一项
      update: (id, patch) =>
        set((state) => ({
          posts: state.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      // 删除：filter 出新数组
      remove: (id) =>
        set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),

      // 恢复示例数据（方便反复演示）
      reset: () => set({ posts: SEED_POSTS }),
    }),
    {
      name: "blog-posts", // localStorage 的 key
      // partialize：只持久化数据，函数不进 localStorage
      partialize: (state) => ({ posts: state.posts }),
      version: 1,
    },
  ),
);
