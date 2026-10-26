// 训练1：JSX 三件套 —— 变量插值、列表 map、className 样式
export default function JsxBasics() {
  const name = "我的博客";
  const posts = ["第一篇：从零建项目", "第二篇：组件与 props", "第三篇：状态与重渲染"];

  return (
    <section className="panel">
      <h2>训练1 · JSX 基础三件套</h2>
      <p className="lead">
        验收点：h1 显示变量值 · 列表三项渲染且无 key 警告 · className 样式生效且控制台无报错
      </p>

      <div className="card">
        {/* 花括号里可以放任何 JS 表达式：变量、运算、函数调用 */}
        <h1 className="demo-title">欢迎来到{name}</h1>
        <p className="muted">上面这行来自 <code>{"<h1>欢迎来到{name}</h1>"}</code>，name 是变量。</p>

        <ul className="demo-list">
          {posts.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>

        <p className="dot-box">这个浅蓝底 + 左侧竖线是 className="dot-box" 的样式</p>
      </div>

      <div className="card">
        <h3>Babel REPL 编译对照（3 条结论）</h3>
        <pre className="code">{`// 源码
<div className="box"><h1>你好，{name}</h1></div>

// babeljs.io/repl 编译产物（简化）
React.createElement("div", { className: "box" },
  React.createElement("h1", null, "你好，", name)
);`}</pre>
        <ol className="notes">
          <li><b>为什么是 className 不是 class？</b>JSX 编译成 JS 对象，class 是 JS 保留字，属性名只能用 className（DOM 属性名）。</li>
          <li><b>插值变成什么？</b>{`{name}`} 变成 createElement 的第三个及之后的 children 参数，按顺序拼进子节点。</li>
          <li><b>标签变成什么？</b>小写标签变成字符串 <code>"div"</code> 去创建 DOM；大写开头 <code>&lt;Div /&gt;</code> 变成变量引用（组件），所以组件名必须大写。</li>
        </ol>
      </div>
    </section>
  );
}
