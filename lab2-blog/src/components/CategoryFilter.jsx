const CATEGORIES = ["全部", "技术", "随笔", "生活"];

// 分类过滤：只接当前值和回调，自己不存 state（当前分类在 App）
export default function CategoryFilter({ current, onChange, counts }) {
  return (
    <div className="filter">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          className={cat === current ? "chip chip-on" : "chip"}
          onClick={() => onChange(cat)}
        >
          {cat}
          <span className="chip-count">{counts[cat] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
