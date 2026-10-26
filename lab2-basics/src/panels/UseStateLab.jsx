import { useState } from "react";

// 训练3：useState 四连 —— 计数器 / 受控输入 / 开关 / 数组增删改
export default function UseStateLab() {
  // 1 计数器
  const [count, setCount] = useState(0);

  // 2 受控输入
  const [text, setText] = useState("");

  // 3 开关
  const [on, setOn] = useState(true);

  // 4 数组增删改：每次都用新数组
  const [items, setItems] = useState([
    { id: 1, text: "买咖啡豆" },
    { id: 2, text: "写实验报告" },
  ]);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  function addItem() {
    const value = draft.trim();
    if (!value) return;
    setItems([{ id: Date.now(), text: value }, ...items]); // 展开，不动原数组
    setDraft("");
  }

  function removeItem(id) {
    setItems(items.filter((it) => it.id !== id)); // filter，不动原数组
  }

  function saveEdit(id) {
    setItems(items.map((it) => (it.id === id ? { ...it, text: editingText } : it))); // map + 展开
    setEditingId(null);
  }

  return (
    <section className="panel">
      <h2>训练3 · useState 四连</h2>
      <p className="lead">验收点：四个练习都跑通 · 数组操作全是 map / filter / 展开，没有 push · 状态值在页面上直接可见</p>

      <div className="grid2">
        <div className="card">
          <h3>① 计数器</h3>
          <p className="big-num">{count}</p>
          <div className="row">
            <button className="btn" onClick={() => setCount(count + 1)}>+1</button>
            <button className="btn ghost" onClick={() => setCount(0)}>归零</button>
          </div>
          <p className="muted small">setCount 只排队，不立刻改当前这次渲染里的 count。</p>
        </div>

        <div className="card">
          <h3>② 受控输入</h3>
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="随便输点什么" />
          <p className="echo">你输入了：<b>{text || "（空）"}</b></p>
          <p className="muted small">value 绑 state、onChange 改 state —— 输入框的“真值”在 React 手里。</p>
        </div>

        <div className="card">
          <h3>③ 开关</h3>
          <div className={"lamp " + (on ? "lamp-on" : "lamp-off")}>{on ? "开" : "关"}</div>
          <button className="btn" onClick={() => setOn(!on)}>切换</button>
          <p className="muted small">布尔 state 直接取反即可。</p>
        </div>

        <div className="card">
          <h3>④ 数组增删改</h3>
          <div className="row">
            <input className="input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="新任务" />
            <button className="btn" onClick={addItem}>加一项</button>
          </div>
          <ul className="todo">
            {items.map((it) => (
              <li key={it.id}>
                {editingId === it.id ? (
                  <>
                    <input className="input sm" value={editingText} onChange={(e) => setEditingText(e.target.value)} />
                    <button className="btn sm" onClick={() => saveEdit(it.id)}>保存</button>
                  </>
                ) : (
                  <>
                    <span>{it.text}</span>
                    <span className="row">
                      <button
                        className="btn sm ghost"
                        onClick={() => {
                          setEditingId(it.id);
                          setEditingText(it.text);
                        }}
                      >
                        改
                      </button>
                      <button className="btn sm danger" onClick={() => removeItem(it.id)}>删</button>
                    </span>
                  </>
                )}
              </li>
            ))}
            {items.length === 0 && <li className="muted">列表空了，再加一项试试</li>}
          </ul>
        </div>
      </div>

      <p className="conclusion">
        一句话结论：数组必须换新数组，因为 React 用 <code>Object.is</code> 比较引用有没有变——原地 push 之后引用没变，它认为“没变”，就不重渲染。
      </p>
    </section>
  );
}
