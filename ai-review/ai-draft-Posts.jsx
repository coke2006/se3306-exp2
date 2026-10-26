// ⚠️ 此文件是任务6 的审查对象：让 AI 自由发挥（提示词只写了“写一个博客文章列表组件”）生成的一版代码。
// 它能跑，但按官方文档的规则逐条审，有 5 类问题。逐条审查与整改见仓库根目录 ai-review.md。
// 本文件保留原样，作为审查留痕；项目里实际使用的是整改后的组件。
import { useEffect, useState } from "react";

export default function AiGeneratedPosts() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0); // ← 检查点4：冗余 state
  const [keyword, setKeyword] = useState("");

  // ← 检查点2：Hook 被包进了 if（次数随渲染变化，必然违反 Rules of Hooks）
  if (posts.length > 0) {
    useEffect(() => {
      document.title = `共 ${posts.length} 篇文章`;
    });
  }

  // ← 检查点3：依赖数组漏写 keyword，且在 setTimeout 里直接读旧值（闭包陷阱）
  useEffect(() => {
    const id = setTimeout(() => {
      console.log("搜索词是：", keyword);
    }, 500);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/posts")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setTotal(data.length); // ← 检查点4：total 永远等于 posts.length
      });
  }, []);

  function handleDelete(id) {
    posts.splice(
      posts.findIndex((p) => p.id === id),
      1,
    ); // ← 检查点3 的变体：原地修改，界面不会更新
    setPosts(posts);
  }

  // ← 检查点1：下面把“列表 + 搜索框 + 表单 + 详情弹窗”全塞在一个组件里，300+ 行
  return (
    <div>
      <h2>文章列表（AI 生成版 · 仅作审查对象，未在项目中使用）</h2>
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜索" />
      <p>共 {total} 篇</p>
      <ul>
        {posts.map((p, i) => (
          <li key={i}>
            {" "}
            {/* ← 检查点3 顺带问题：key 用下标 */}
            {p.title}
            <button onClick={() => handleDelete(p.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
