// 训练2：ES6 七语法 —— 每条都真实跑一遍，把结果渲染出来
export default function Es6Practice() {
  // 1 箭头函数
  const add = (a, b) => a + b;

  // 2 解构
  const post = { id: 1, title: "第一篇", category: "技术" };
  const { title, category } = post;

  // 3 展开：新文章插到最前面，不改原数组
  const posts = [{ id: 1, title: "第一篇", category: "技术" }, { id: 2, title: "第二篇", category: "生活" }];
  const newPost = { id: 3, title: "第三篇", category: "技术" };
  const merged = [newPost, ...posts];

  // 4 map：取出所有标题
  const titles = posts.map((p) => p.title);

  // 5 filter：只看技术分类
  const techPosts = posts.filter((p) => p.category === "技术");

  // 6 find：按 id 找
  const found = posts.find((p) => p.id === 2);

  // 7 模板字符串
  const desc = `文章：${post.title}，分类：${post.category}`;

  const rows = [
    { name: "1 箭头函数", code: "const add = (a, b) => a + b", out: `add(2, 3) = ${add(2, 3)}`, use: "所有事件回调、map/filter 的参数" },
    { name: "2 解构", code: "const { title, category } = post", out: `${title} / ${category}`, use: "PostItem 里直接从 post 拿字段" },
    { name: "3 展开", code: "[newPost, ...posts]", out: merged.map((p) => p.id).join(" → "), use: "发布文章：setPosts([新文章, ...posts])" },
    { name: "4 map", code: "posts.map(p => p.title)", out: titles.join("、"), use: "把 posts 渲染成卡片列表" },
    { name: "5 filter", code: "posts.filter(p => p.category === '技术')", out: techPosts.map((p) => p.title).join("、"), use: "分类过滤、删除文章" },
    { name: "6 find", code: "posts.find(p => p.id === 2)", out: found ? `${found.id} - ${found.title}` : "未找到", use: "点开详情时按 id 取文章" },
    { name: "7 模板字符串", code: "`文章：${title}，分类：${category}`", out: desc, use: "拼接提示文案、aria-label" },
  ];

  return (
    <section className="panel">
      <h2>训练2 · ES6 七个语法</h2>
      <p className="lead">
        验收点：7 个语法各一个可运行例子 · 说得出博客里用在哪 · 输出在页面上直接可见（等价于控制台验证）
      </p>

      <table className="tbl">
        <thead>
          <tr>
            <th style={{ width: 130 }}>语法</th>
            <th style={{ width: 300 }}>代码</th>
            <th style={{ width: 190 }}>运行结果</th>
            <th>博客里用在哪</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td><code>{r.code}</code></td>
              <td className="ok">{r.out}</td>
              <td className="muted">{r.use}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="conclusion">一句话结论：博客开发里最常用的是<b>展开</b>与 <b>map</b>——一个负责不可变地加数据，一个负责把数组变成界面。</p>
    </section>
  );
}
