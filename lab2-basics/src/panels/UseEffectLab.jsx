import { useEffect, useState } from "react";

// 三个只做统计的探针组件，分别代表 useEffect 的三种依赖形态。
// 计数存在模块级变量里，不触发重渲染，避免“统计本身又引起渲染”的死循环。
const execCount = { every: 0, once: 0, dep: 0 };

function ProbeEveryRender() {
  useEffect(() => {
    execCount.every += 1; // 不写依赖数组 = 每次渲染后都跑
  });
  return null;
}

function ProbeOnce() {
  useEffect(() => {
    execCount.once += 1; // 空数组 = 只在挂载后跑一次
  }, []);
  return null;
}

function ProbeOnDep({ n }) {
  useEffect(() => {
    execCount.dep += 1; // 写了依赖 = 依赖变了才跑
  }, [n]);
  return null;
}

// ④ 闭包陷阱：错误写法
function NaiveTrap() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState([]);

  function click() {
    // 这里读到的是本次渲染时的 count（快照），连点三次都在读 0
    setTimeout(() => {
      setCount(count + 1);
      setLog((l) => [...l, `想设为 ${count + 1}`]);
    }, 300);
  }

  return (
    <div className="card card-bad">
      <h3>❌ 直接读 state</h3>
      <p className="big-num">{count}</p>
      <div className="row">
        <button className="btn danger" onClick={click}>连点 3 次</button>
        <button className="btn ghost" onClick={() => { setCount(0); setLog([]); }}>重置</button>
      </div>
      <p className="muted small">三次定时器里的输出：{log.length ? log.join(" / ") : "（还没点）"}</p>
    </div>
  );
}

// ④ 闭包陷阱：正确写法（函数式更新）
function FixedTrap() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState([]);

  function click() {
    setTimeout(() => {
      setCount((c) => c + 1); // 拿到的是“最新值”，不是在渲染时捕获的旧值
      setLog((l) => [...l, "函数式 +1"]);
    }, 300);
  }

  return (
    <div className="card card-good">
      <h3>✅ 函数式更新</h3>
      <p className="big-num">{count}</p>
      <div className="row">
        <button className="btn" onClick={click}>连点 3 次</button>
        <button className="btn ghost" onClick={() => { setCount(0); setLog([]); }}>重置</button>
      </div>
      <p className="muted small">三次定时器的输出：{log.length ? log.join(" / ") : "（还没点）"}</p>
    </div>
  );
}

export default function UseEffectLab() {
  const [count, setCount] = useState(0);
  const [pageTitle, setPageTitle] = useState(document.title);
  const [n, setN] = useState(0);
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // ① 改标题：count 变了才同步 document.title
  useEffect(() => {
    document.title = `点击了 ${count} 次 · 训练5`;
    setPageTitle(document.title);
  }, [count]);

  // ③ 定时器：启动时建，停止或卸载时清
  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id); // 清理函数，防止组件卸载后还在跑
  }, [running]);

  return (
    <section className="panel">
      <ProbeEveryRender />
      <ProbeOnce />
      <ProbeOnDep n={n} />
      {/* tick 只用来强制本组件重渲染，让上面的统计数字刷新 */}
      <span hidden>{tick}</span>

      <h2>训练5 · useEffect 四种形态</h2>
      <p className="lead">验收点：三种依赖形态的执行次数说对 · 定时器清理后无报错 · 闭包陷阱复现并修复</p>

      <div className="grid2">
        <div className="card">
          <h3>① 副作用同步：改标题</h3>
          <p className="big-num">{count}</p>
          <button className="btn" onClick={() => setCount(count + 1)}>+1</button>
          <p className="muted small">浏览器标签页标题现在是：<b>{pageTitle}</b></p>
        </div>

        <div className="card">
          <h3>② 三种依赖形态</h3>
          <table className="tbl tight">
            <thead>
              <tr><th>写法</th><th>执行次数</th><th>什么时候跑</th></tr>
            </thead>
            <tbody>
              <tr><td><code>useEffect(fn)</code></td><td className="ok">{execCount.every}</td><td>每次渲染后</td></tr>
              <tr><td><code>useEffect(fn, [])</code></td><td className="ok">{execCount.once}</td><td>只在挂载后一次</td></tr>
              <tr><td><code>useEffect(fn, [n])</code></td><td className="ok">{execCount.dep}</td><td>n 变化时</td></tr>
            </tbody>
          </table>
          <div className="row">
            <button className="btn sm" onClick={() => setN(n + 1)}>n +1（会触发第 3 行）</button>
            <button className="btn sm ghost" onClick={() => setTick(tick + 1)}>只重渲染（不动 n）</button>
          </div>
        </div>

        <div className="card">
          <h3>③ 定时器与清理</h3>
          <p className="big-num">{seconds}s</p>
          <div className="row">
            <button className="btn" onClick={() => setRunning(!running)}>{running ? "暂停（触发 cleanup）" : "开始"}</button>
            <button className="btn ghost" onClick={() => { setRunning(false); setSeconds(0); }}>清零</button>
          </div>
          <p className="muted small">状态：{running ? "计时中，cleanup 还没执行" : "已停止，clearInterval 已执行，不再累加"}</p>
        </div>

      </div>

      <h3 className="sub-title">④ 闭包陷阱对照：连点 3 次（每下间隔小于 300ms），左边只到 1，右边到 3</h3>
      <div className="grid2">
        <NaiveTrap />
        <FixedTrap />
      </div>

      <p className="conclusion">
        一句话结论：依赖数组告诉 React 什么时候重跑这个 effect；不写依赖就等于每次渲染都跑，写 <code>[]</code> 等于只跑一次。
        定时器必须返回清理函数，否则卸载后还在改一个已经不存在的组件的 state。
      </p>
    </section>
  );
}
