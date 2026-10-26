import { useState } from "react";

// 详情：点卡片打开，读全文 + 编辑 + 删除（删除用两步确认，避免误点）
export default function PostDetail({ post, onClose, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  if (!post) return null;

  return (
    <div className="mask" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="post-head">
          <span className={"badge badge-" + post.category}>{post.category}</span>
          <span className="date">{post.publishedAt}</span>
          <button className="close" type="button" onClick={onClose}>×</button>
        </div>
        <h2 className="modal-title">{post.title}</h2>
        <p className="modal-body">{post.content}</p>

        <div className="row modal-actions">
          <button className="btn" type="button" onClick={() => onEdit(post.id)}>编辑</button>
          {confirming ? (
            <>
              <button className="btn danger" type="button" onClick={() => onDelete(post.id)}>确认删除</button>
              <button className="btn ghost" type="button" onClick={() => setConfirming(false)}>取消</button>
            </>
          ) : (
            <button className="btn danger" type="button" onClick={() => setConfirming(true)}>删除</button>
          )}
        </div>
      </div>
    </div>
  );
}
