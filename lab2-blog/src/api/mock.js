// 模拟后台：4 篇示例文章 + 五个接口的真实实现
// 接入真实后台后，把这个文件删掉、把 client.js 的 BASE_URL 填上即可
export const SEED_POSTS = [
  {
    id: "1",
    title: "从 create-vite 开始的第一天",
    category: "技术",
    summary: "脚手架到底给我生成了什么",
    content:
      "index.html 里只有一个 #root，main.jsx 把 App 挂上去，剩下全靠组件。看懂这条链条，后面加多少组件都不慌。",
    publishedAt: "2026-09-22",
  },
  {
    id: "2",
    title: "组件化让我少写了很多重复代码",
    category: "随笔",
    summary: "把界面想成积木",
    content:
      "同一张卡片出现三次，就该抽成组件。props 是插口，state 是它自己的记忆，抽完之后改动只在一个地方发生。",
    publishedAt: "2026-09-25",
  },
  {
    id: "3",
    title: "useState 到 Zustand：状态到底该放哪",
    category: "技术",
    summary: "从组件内到全局，一次迁移记录",
    content:
      "组件自己用的状态就留在组件里；跨层级、跨页签共享的才提升。提升过头会变成“什么都要从顶层传”，迁移到 store 之后组件之间终于解耦了。",
    publishedAt: "2026-09-28",
  },
  {
    id: "4",
    title: "把 dist 扔上托管平台的那五分钟",
    category: "生活",
    summary: "构建产物与部署",
    content:
      "pnpm build 之后 dist 里就是纯静态文件，传到托管平台就能访问。第一次看到自己的页面挂在公网上，感觉还挺奇妙。",
    publishedAt: "2026-10-02",
  },
];

const db = { posts: SEED_POSTS.map((p) => ({ ...p })) };

// 每次请求返回 { code, message, data } 的统一信封，和真实后台约定一致
export function mockRequest(path, options = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const method = options.method || "GET";
      const [pathname, queryString] = path.split("?");
      const id = pathname.split("/")[2];
      const params = new URLSearchParams(queryString || "");
      const category = params.get("category");

      let data = null;
      if (method === "GET") {
        if (id) {
          data = db.posts.find((p) => p.id === id) || null;
        } else if (category && category !== "全部") {
          data = db.posts.filter((p) => p.category === category);
        } else {
          data = [...db.posts];
        }
      } else if (method === "POST") {
        const post = {
          ...JSON.parse(options.body),
          id: String(Date.now()),
          publishedAt: new Date().toISOString().slice(0, 10),
        };
        db.posts = [post, ...db.posts];
        data = post;
      } else if (method === "PUT") {
        db.posts = db.posts.map((p) =>
          p.id === id ? { ...p, ...JSON.parse(options.body) } : p,
        );
        data = db.posts.find((p) => p.id === id);
      } else if (method === "DELETE") {
        db.posts = db.posts.filter((p) => p.id !== id);
        data = { id };
      }

      if (data === null && id) {
        resolve({ code: 404, message: "文章不存在", data: null });
        return;
      }
      resolve({ code: 0, message: "ok", data });
    }, 300); // 300ms 延迟，模拟真实网络
  });
}
