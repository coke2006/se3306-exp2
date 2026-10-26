import { useState } from "react";
import JsxBasics from "./panels/JsxBasics";
import Es6Practice from "./panels/Es6Practice";
import UseStateLab from "./panels/UseStateLab";
import KeyTrap from "./panels/KeyTrap";
import UseEffectLab from "./panels/UseEffectLab";
import WindowSizeDemo from "./panels/WindowSizeDemo";
import ThinkingInReact from "./panels/ThinkingInReact";

// 任务2 的六个训练 + 任务3 的四步法，各占一个页签
// 这样每个训练都能单独截图，也方便对照报告里的验收标准
const TABS = [
  { key: "t1", label: "训练1 JSX 三件套", Comp: JsxBasics },
  { key: "t2", label: "训练2 ES6 七语法", Comp: Es6Practice },
  { key: "t3", label: "训练3 useState 四连", Comp: UseStateLab },
  { key: "t4", label: "训练4 index 作 key", Comp: KeyTrap },
  { key: "t5", label: "训练5 useEffect", Comp: UseEffectLab },
  { key: "t6", label: "训练6 自定义 Hook", Comp: WindowSizeDemo },
  { key: "t3p", label: "任务3 四步法", Comp: ThinkingInReact },
];

export default function App() {
  const [active, setActive] = useState("t1");
  const current = TABS.find((t) => t.key === active);
  const Current = current.Comp;

  return (
    <div className="page">
      <header className="site-header">
        <h1>React 基础训练营</h1>
        <p className="sub">
          任务二 · 六个渐进训练 + 任务三 · Thinking in React 四步法（可搜索产品表格）
        </p>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={t.key === active ? "tab tab-on" : "tab"}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="panel-wrap">
        <Current />
      </main>

      <footer className="foot">
        每个面板都能独立运行：输入、点击、拖窗口都会即时看到结果。所有列表渲染都用稳定 id
        作 key，所有数组更新都用新数组（map / filter / 展开），没有一处 push。
      </footer>
    </div>
  );
}
