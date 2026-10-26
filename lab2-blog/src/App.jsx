import { useMemo, useState } from "react";
import Header from "./components/Header";
import PostForm from "./components/PostForm";
import CategoryFilter from "./components/CategoryFilter";
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import RemotePosts from "./components/RemotePosts";
import About from "./components/About";
import { usePostStore } from "./store/usePostStore";

export default function App() {
  const [tab, setTab] = useState("local");

  // 这几个都是“界面状态”，只影响当前视图，用 useState 就够
  const [category, setCategory] = useState("全部");
  const [keyword, setKeyword] = useState("");
  const [openId, setOpenId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // 文章数据与三个动作来自全局 store（任务5 的迁移结果）
  const posts = usePostStore((s) => s.posts);
  const publish = usePostStore((s) => s.publish);
  const update = usePostStore((s) => s.update);
  const remove = usePostStore((s) => s.remove);
  const reset = usePostStore((s) => s.reset);

  // 第10步：数量是算出来的，不设第二个 state
  const counts = useMemo(() => {
    const map = { 全部: posts.length };
    posts.forEach((p) => {
      map[p.category] = (map[p.category] ?? 0) + 1;
    });
    return map;
  }, [posts]);

  // 第11步：分类与搜索词提升到 App，列表只是“算出来的视图”
  const visible = useMemo(() => {
    const kw = keyword.trim();
    return posts.filter((p) => {
      const okCategory = category === "全部" || p.category === category;
      const okKeyword = !kw || p.title.includes(kw) || p.content.includes(kw);
      return okCategory && okKeyword;
    });
  }, [posts, category, keyword]);

  const editing = posts.find((p) => p.id === editingId) ?? null;
  const openPost = posts.find((p) => p.id === openId) ?? null;

  function handleCreate(draft) {
    publish(draft);
    setCategory("全部");
    setKeyword("");
  }

  function handleUpdate(id, patch) {
    update(id, patch);
    setEditingId(null);
    setOpenId(null);
  }

  function handleDelete(id) {
    remove(id);
    setOpenId(null);
    setEditingId(null);
  }

  return (
    <div className="page">
      <Header tab={tab} onTabChange={setTab} />

      {tab === "local" && (
        <>
          <div className="statbar">
            <span className="stat"><b>{counts["全部"]}</b> 篇文章</span>
            <span className="stat">技术 <b>{counts["技术"] ?? 0}</b></span>
            <span className="stat">随笔 <b>{counts["随笔"] ?? 0}</b></span>
            <span className="stat">生活 <b>{counts["生活"] ?? 0}</b></span>
            <span className="stat-note">数据来自 Zustand store + persist（localStorage: blog-posts）</span>
            <button className="btn ghost sm" type="button" onClick={reset}>恢复示例文章</button>
          </div>

          <div className="layout">
            <div className="side">
              <PostForm
                key={editing ? editing.id : "new"}
                editing={editing}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onCancel={() => setEditingId(null)}
              />
            </div>

            <div className="main">
              <div className="list-head">
                <CategoryFilter current={category} onChange={setCategory} counts={counts} />
                <input
                  className="input search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索标题或正文…"
                />
              </div>

              <p className="list-meta">
                当前显示 {visible.length} 篇
                {category !== "全部" && ` · 分类「${category}」`}
                {keyword.trim() && ` · 关键词「${keyword.trim()}」`}
              </p>

              <PostList posts={visible} onOpen={setOpenId} keyword={keyword.trim()} />
            </div>
          </div>

          {openPost && (
            <PostDetail
              post={openPost}
              onClose={() => setOpenId(null)}
              onEdit={(id) => {
                setOpenId(null);
                setEditingId(id);
              }}
              onDelete={handleDelete}
            />
          )}
        </>
      )}

      {tab === "remote" && <RemotePosts />}
      {tab === "about" && <About />}

      <footer className="foot">
        实验二 · lab2-blog ｜ React 19 + Vite 6 ｜ Zustand 5（persist + partialize）｜ TanStack Query 5 ｜
        数据层：src/api/client.js 的 BASE_URL 一改就能接真实后台
      </footer>
    </div>
  );
}
