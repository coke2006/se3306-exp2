import { useWindowSize } from "../hooks/useWindowSize";

// 训练6：把“监听窗口尺寸”这段逻辑封装成 Hook，任何组件一行调用即可复用
export default function WindowSizeDemo() {
  const { width, height } = useWindowSize();

  const level = width >= 1200 ? "桌面宽屏" : width >= 768 ? "平板 / 小窗" : "手机窄屏";

  return (
    <section className="panel">
      <h2>训练6 · 自定义 Hook：useWindowSize</h2>
      <p className="lead">验收点：拖动窗口数字实时变 · 组件卸载无报错 · 说得清为什么必须以 use 开头</p>

      <div className="card center">
        <p className="muted small">当前视口（拖动浏览器窗口边缘或缩放页面，这里会实时变化）</p>
        <p className="big-num size">{width} × {height}</p>
        <p className="badge">{level}</p>
        <div className="bar" style={{ width: Math.min(width / 12, 560) }} />
      </div>

      <div className="card">
        <h3>三句话讲清自定义 Hook</h3>
        <ul className="notes">
          <li><b>它是什么：</b>一个普通函数，函数体里调用了 useState / useEffect。<code>useWindowSize()</code> 返回 <code>{"{ width, height }"}</code>，和 useState 一样是「值 + 更新方式」的组合。</li>
          <li><b>复用的是逻辑，不是界面：</b>Hook 里没有任何 JSX。两个组件同时调用它，各自拿到独立的 state，只是“监听 resize”这段逻辑不用抄第二遍。</li>
          <li><b>为什么必须 use 开头：</b>React 靠命名识别 Hook，ESLint 的 rules-of-hooks 也只检查 use* 开头的函数，才能保证“不在 if/for 里调用”这条规则不被绕过。</li>
        </ul>
      </div>

      <p className="conclusion">一句话结论：自定义 Hook 复用的是逻辑，不是界面。</p>
    </section>
  );
}
