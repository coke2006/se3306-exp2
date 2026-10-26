const TABS = [
  { key: "local", label: "本地博客" },
  { key: "remote", label: "服务端文章" },
  { key: "about", label: "关于本项目" },
];

export default function Header({ tab, onTabChange }) {
  return (
    <header className="site-header">
      <div className="brand">
        <div>
          <h1>陈博的博客</h1>
          <p className="sub">SE3306 实验二 · 组件 / 状态 / 持久化 / Zustand / TanStack Query</p>
        </div>
        <nav className="nav">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={tab === t.key ? "nav-btn nav-on" : "nav-btn"}
              onClick={() => onTabChange(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
