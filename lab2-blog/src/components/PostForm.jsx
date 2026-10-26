import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const EMPTY = { title: "", category: "技术", summary: "", content: "" };
const CATEGORIES = ["技术", "随笔", "生活"];

// 第7步 响应事件 + 第8.5步 四字段受控表单 + 第12步 草稿持久化
export default function PostForm({ editing, onCreate, onUpdate, onCancel }) {
  // 草稿存 localStorage：写到一半关掉页面，回来还在（这就是 useLocalStorage 的实际用途）
  const [draft, setDraft] = useLocalStorage("blog-draft", EMPTY);
  const [editForm, setEditForm] = useState(editing ? { ...editing } : EMPTY);
  const [error, setError] = useState("");

  const isEdit = Boolean(editing);
  const form = isEdit ? editForm : draft;

  function setField(field, value) {
    setError("");
    if (isEdit) setEditForm((f) => ({ ...f, [field]: value }));
    else setDraft((d) => ({ ...d, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault(); // 第7步：拦住表单默认的整页刷新
    if (!form.title.trim() || !form.content.trim()) {
      setError("标题和正文不能为空");
      return;
    }
    if (isEdit) {
      onUpdate(editing.id, form);
    } else {
      onCreate(form);
      setDraft(EMPTY);
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>{isEdit ? "编辑文章" : "写文章"}</h2>

      <label className="field">
        <span>标题</span>
        <input
          className="input"
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          placeholder="给文章起个标题"
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>分类</span>
          <select
            className="input"
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>摘要（可留空，会自动截正文）</span>
          <input
            className="input"
            value={form.summary}
            onChange={(e) => setField("summary", e.target.value)}
            placeholder="一句话介绍"
          />
        </label>
      </div>

      <label className="field">
        <span>正文</span>
        <textarea
          className="input"
          rows={5}
          value={form.content}
          onChange={(e) => setField("content", e.target.value)}
          placeholder="正文写在这里……"
        />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="row">
        <button className="btn" type="submit">{isEdit ? "保存修改" : "发布"}</button>
        {isEdit ? (
          <button className="btn ghost" type="button" onClick={onCancel}>取消</button>
        ) : (
          <button
            className="btn ghost"
            type="button"
            onClick={() => setDraft(EMPTY)}
          >
            清空草稿
          </button>
        )}
        <span className="muted small">
          {isEdit ? "编辑中不会改动草稿" : "草稿已自动存本地，刷新不丢"}
        </span>
      </div>
    </form>
  );
}
