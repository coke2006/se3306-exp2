import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockRequest } from "../api/mock";

// 任务5-2：服务端状态交给 TanStack Query，数据来自 json-server（本地）或内置 mock（线上）
const SOURCES = [
  { key: "json", label: "json-server（localhost:3000）", base: "http://localhost:3000" },
  { key: "mock", label: "内置 mock（线上兜底）", base: "mock" },
  { key: "broken", label: "故障演练（端口 3999，必定失败）", base: "http://localhost:3999" },
];

async function fetchRemotePosts(source) {
  if (source.base === "mock") {
    const body = await mockRequest("/posts");
    return [...body.data].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }
  const res = await fetch(`${source.base}/posts`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const list = await res.json();
  return [...list].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

async function createRemotePost(source, draft) {
  const payload = {
    ...draft,
    summary: draft.summary || "来自服务端列表的乐观更新",
    content: draft.content || "这条数据由 TanStack Query 的 useMutation 写到 mock 后台。",
    publishedAt: new Date().toISOString().slice(0, 10),
  };
  if (source.base === "mock") {
    const body = await mockRequest("/posts", { method: "POST", body: JSON.stringify(payload) });
    return body.data;
  }
  const res = await fetch(`${source.base}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function RemotePosts() {
  // 线上没有 json-server，默认切到内置 mock；本地默认走真实 mock 后台
  const [sourceKey, setSourceKey] = useState(import.meta.env.PROD ? "mock" : "json");
  const source = SOURCES.find((s) => s.key === sourceKey);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("技术");
  const [log, setLog] = useState("");

  const queryClient = useQueryClient();
  const queryKey = ["remote-posts", sourceKey];

  // 三态：isPending / isError / 成功
  const { data, isPending, isError, error, isFetching, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchRemotePosts(source),
    retry: false,
    staleTime: 10_000, // 10 秒内重复切回来不重新请求（缓存命中）
  });

  // 乐观更新四步：取消旧查询 → 快照并插入 → 失败回滚 → 结束后重拉对齐
  const addPost = useMutation({
    mutationFn: (draft) => createRemotePost(source, draft),
    onMutate: async (draft) => {
      setLog("① 乐观插入：界面先秒出（还没落库）");
      await queryClient.cancelQueries({ queryKey });
      const prev = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old = []) => [
        { ...draft, id: `tmp-${Date.now()}`, summary: "（乐观插入的临时数据）", publishedAt: new Date().toISOString().slice(0, 10) },
        ...old,
      ]);
      return { prev };
    },
    onSuccess: () => setLog("② 服务端写入成功"),
    onError: (err, _draft, ctx) => {
      queryClient.setQueryData(queryKey, ctx.prev); // ③ 回滚到快照
      setLog(`③ 失败，已回滚：${err.message}`);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey }); // ④ 重新拉取对齐
      setLog((l) => `${l} → ④ 重新拉取对齐`);
    },
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    addPost.mutate({ title: title.trim(), category });
    setTitle("");
  }

  return (
    <section>
      <div className="card">
        <h2>服务端文章列表（TanStack Query）</h2>
        <p className="muted small">
          数据不在浏览器里，浏览器只持有缓存副本。三态：pending 骨架屏 / error 提示 / success 列表。
          点发布走 useMutation 的乐观更新，右上角能看到四步日志。
        </p>

        <div className="row" style={{ marginTop: 12 }}>
          <span className="muted small">数据源</span>
          <select className="input" style={{ maxWidth: 320 }} value={sourceKey} onChange={(e) => { setSourceKey(e.target.value); setLog(""); }}>
            {SOURCES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <button className="btn ghost sm" type="button" onClick={() => refetch()}>
            {isFetching ? "拉取中…" : "重新拉取"}
          </button>
          {isFetching && !isPending && <span className="muted small">后台刷新中（旧数据仍在，不闪屏）</span>}
        </div>
      </div>

      <form className="card" onSubmit={handleAdd}>
        <h3>发布一条到 mock 后台（乐观更新）</h3>
        <div className="row">
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="文章标题" />
          <select className="input" style={{ maxWidth: 110 }} value={category} onChange={(e) => setCategory(e.target.value)}>
            {["技术", "随笔", "生活"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn" type="submit">发布</button>
        </div>
        {log && <p className="mut-log">{log}</p>}
      </form>

      <div className="card">
        {isPending && (
          <div className="skeleton-wrap" aria-label="加载中">
            <p className="muted small">pending：请求还没回来，先占位（骨架屏）</p>
            {[0, 1, 2].map((i) => (
              <div className="skeleton" key={i}>
                <span className="sk-line w40" />
                <span className="sk-line w80" />
                <span className="sk-line w60" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="error-box">
            <b>error：{error.message}</b>
            <p className="small">连不上 {source.base}。本地起 mock 后台：<code>pnpm run mock</code>；线上请把数据源切到「内置 mock」。</p>
            <button className="btn sm" type="button" onClick={() => refetch()}>重试</button>
          </div>
        )}

        {!isPending && !isError && (
          <>
            <div className="row between">
              <h3>共 {data.length} 篇</h3>
              <span className="muted small">queryKey: {JSON.stringify(queryKey)}</span>
            </div>
            <ul className="remote-list">
              {data.map((p) => (
                <li key={p.id}>
                  <span className={"badge badge-" + p.category}>{p.category}</span>
                  <span className="remote-title">{p.title}</span>
                  {String(p.id).startsWith("tmp-") && <span className="tmp-tag">临时</span>}
                  <span className="date">{p.publishedAt}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
