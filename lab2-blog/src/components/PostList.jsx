import PostItem from "./PostItem";

export default function PostList({ posts, onOpen, keyword }) {
  // 第5步 条件渲染：空态
  if (posts.length === 0) {
    return (
      <div className="empty">
        <p className="empty-title">{keyword ? "没有匹配的文章" : "还没有文章，写下第一篇吧"}</p>
        <p className="muted small">
          {keyword ? `换个关键词试试，当前搜索「${keyword}」` : "左边填标题和正文，点发布就会出现在这里"}
        </p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {/* 第6步 渲染列表：key 用稳定 id，不用 index */}
      {posts.map((post) => (
        <PostItem key={post.id} post={post} onOpen={onOpen} />
      ))}
    </div>
  );
}
