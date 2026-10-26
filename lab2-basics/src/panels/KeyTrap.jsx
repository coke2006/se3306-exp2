import { useState } from "react";

const INITIAL = [
  { id: "u1", label: "用户 A" },
  { id: "u2", label: "用户 B" },
  { id: "u3", label: "用户 C" },
];

// 训练4：亲眼看到 index 作 key 的坑
// 两个列表结构完全一样，唯一区别是 key 用下标还是用 id。
// 输入框故意写成非受控（defaultValue），这样能看清 React 复用了哪个 DOM 节点。
export default function KeyTrap() {
  const [byIndex, setByIndex] = useState(INITIAL);
  const [byId, setById] = useState(INITIAL);

  return (
    <section className="panel">
      <h2>训练4 · index 作 key 的坑</h2>
      <p className="lead">
        操作：在两个列表的输入框里分别输入不同内容 → 各点一次「删除第一项」→ 看谁串位。
        key 的作用是给 React 认节点；用下标当 key，删除后下标整体前移，React 认错了人。
      </p>

      <div className="grid2">
        <div className="card card-bad">
          <h3>❌ key={"{"}index{"}"}</h3>
          <ul className="keylist">
            {byIndex.map((item, index) => (
              <li key={index}>
                <span className="tag">{item.label}</span>
                <input className="input" defaultValue={`我是 ${item.label}`} />
              </li>
            ))}
          </ul>
          <div className="row">
            <button className="btn danger" onClick={() => setByIndex(byIndex.slice(1))}>删除第一项</button>
            <button className="btn ghost" onClick={() => setByIndex(INITIAL)}>重置</button>
          </div>
          <p className="muted small">当前数据：{byIndex.map((i) => i.label).join(" → ") || "空"}</p>
        </div>

        <div className="card card-good">
          <h3>✅ key={"{item.id}"}</h3>
          <ul className="keylist">
            {byId.map((item) => (
              <li key={item.id}>
                <span className="tag">{item.label}</span>
                <input className="input" defaultValue={`我是 ${item.label}`} />
              </li>
            ))}
          </ul>
          <div className="row">
            <button className="btn danger" onClick={() => setById(byId.filter((i) => i.id !== byId[0].id))}>删除第一项</button>
            <button className="btn ghost" onClick={() => setById(INITIAL)}>重置</button>
          </div>
          <p className="muted small">当前数据：{byId.map((i) => i.label).join(" → ") || "空"}</p>
        </div>
      </div>

      <p className="conclusion">
        一句话结论：key 是 React 认节点的身份证。用 index 时，删掉第一项后“第 0 个”变成了原来的第二项，
        React 认为第 0 个还是原来那个节点，只更新了文字，输入框里的 DOM 状态（光标、已输入内容）却留在了旧节点上，于是串位。
        用 id 作 key，节点跟着数据走，删谁就真的移除谁。
      </p>
    </section>
  );
}
