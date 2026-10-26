export default function About() {
  return (
    <section>
      <div className="card">
        <h2>这个项目是怎么长出来的</h2>
        <p className="muted small">
          按 React 中文官网的训练线走了 13 步：建项目 → 第一个组件 → JSX → props → 条件渲染 → 列表 key →
          事件 → useState → 更新数组 → 选择 state 结构 → 状态提升 → 自定义 Hook → 构建部署。
          之后又把组件状态升级成 Zustand、把服务端状态交给 TanStack Query。
        </p>

        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 150 }}>方案</th>
              <th>状态住在哪</th>
              <th>刷新后还在吗</th>
              <th>适合什么</th>
              <th>本项目里用在哪</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><b>useState</b></td>
              <td>组件内部（内存）</td>
              <td className="no">不在了</td>
              <td>只给这个组件和子组件用</td>
              <td>分类、搜索词、当前打开的文章 id、表单</td>
            </tr>
            <tr>
              <td><b>useLocalStorage</b></td>
              <td>浏览器 localStorage</td>
              <td className="ok">还在</td>
              <td>单组件要持久化的小数据</td>
              <td>写文章表单的草稿</td>
            </tr>
            <tr>
              <td><b>Zustand + persist</b></td>
              <td>全局 store（内存）+ localStorage</td>
              <td className="ok">还在</td>
              <td>跨组件、跨页签共享</td>
              <td>文章列表 posts 与增删改动作</td>
            </tr>
            <tr>
              <td><b>TanStack Query</b></td>
              <td>服务器（浏览器只是缓存）</td>
              <td className="ok">服务器在就在</td>
              <td>远程数据、需要三态与重试</td>
              <td>「服务端文章」页签</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>客户端状态 vs 服务端状态：三问</h3>
        <ol className="notes">
          <li><b>数据的所有者各自在哪？</b>本地博客的 posts 归浏览器（写进 localStorage），关掉浏览器数据还在自己机器上；服务端文章归 mock 后台（db.json），浏览器里的只是副本。</li>
          <li><b>换设备 / 换浏览器还在吗？</b>localStorage 不跨设备——换台电脑打开就是空的（示例数据）；服务端数据换设备照样能拉到，因为所有者是服务器。</li>
          <li><b>别人改了要同步吗？</b>本地博客不需要，只有我一个人写；服务端数据需要，所以用 invalidateQueries 重新拉取，别人在后台改了我也能看到。</li>
        </ol>
      </div>

      <div className="card">
        <h3>提交前自查（7 条）</h3>
        <ul className="checklist">
          <li>Zustand store + persist：F5 刷新文章不丢</li>
          <li>selector 精确订阅：<code>usePostStore((s) =&gt; s.posts)</code>，不整包取</li>
          <li>Query 三态可复现：pending 骨架 / error 提示 / success 列表</li>
          <li>queryKey 正确：<code>["remote-posts", sourceKey]</code>，不带每次渲染都变的值</li>
          <li>乐观更新四步：秒出 → 回滚 → 重拉对齐</li>
          <li>ai-review.md：五个检查点，每条三件套</li>
          <li>边界总结：上面那三问，各举了博客里的例子</li>
        </ul>
      </div>
    </section>
  );
}
