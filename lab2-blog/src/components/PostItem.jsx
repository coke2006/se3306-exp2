export default function PostItem({ post, onOpen }) {
  // 第5步 条件渲染：没有摘要就截正文前 60 字兜底
  const summary = post.summary?.trim()
    ? post.summary
    : post.content.slice(0, 60) + (post.content.length > 60 ? "…" : "");

  return (
    <article className="post-item" onClick={() => onOpen(post.id)}>
      <div className="post-head">
        <span className={"badge badge-" + post.category}>{post.category}</span>
        <span className="date">{post.publishedAt}</span>
      </div>
      <h3>{post.title}</h3>
      <p className="summary">{summary}</p>
      <span className="read">阅读全文 →</span>
    </article>
  );
}
