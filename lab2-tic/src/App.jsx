import Game from "./Game";

export default function App() {
  return (
    <div className="page">
      <header className="site-header">
        <h1>井字棋 · 时间旅行版</h1>
        <p className="sub">
          跟着 React 官方教程手写：Square → Board → Game，状态提升 + 不可变更新 + 回到第 n 步
        </p>
      </header>

      <Game />

      <footer className="foot">
        提示：先随便下几步，再点右侧「第 1 步 / 第 2 步」回退，然后从回退点继续落子——
        后面的分支会被砍掉，这就是时间旅行。
      </footer>
    </div>
  );
}
