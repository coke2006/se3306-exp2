import { useState } from "react";

// 任务3：照着官网 thinking-in-react 的「可搜索产品表格」走一遍四步法
// 第1步 拆组件 → 第2步 静态版 → 第3步 找 state → 第4步 定位置
const PRODUCTS = [
  { category: "水果", price: "$1", stocked: true, name: "苹果" },
  { category: "水果", price: "$1", stocked: true, name: "香蕉" },
  { category: "水果", price: "$2", stocked: false, name: "百香果" },
  { category: "蔬菜", price: "$2", stocked: true, name: "菠菜" },
  { category: "蔬菜", price: "$4", stocked: false, name: "南瓜" },
  { category: "蔬菜", price: "$1", stocked: true, name: "豌豆" },
];

// 叶子组件：一个搜索框 + 一个复选框，自己不存状态，全靠 props 收发
function SearchBar({ filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange }) {
  return (
    <form className="searchbar" onSubmit={(e) => e.preventDefault()}>
      <input
        className="input"
        value={filterText}
        placeholder="搜索商品…"
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
      <label className="checkline">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />
        只显示有货
      </label>
    </form>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr className="cat-row">
      <th colSpan={2}>{category}</th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name : <span className="out">{product.name}</span>;
  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

// 第3步的关键：过滤后的列表是“算出来的”，不设 state
function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (!product.name.includes(filterText)) return;
    if (inStockOnly && !product.stocked) return;
    if (product.category !== lastCategory) {
      rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
    }
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });

  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>名称</th>
          <th>价格</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

// 第4步：两个 state 放在共同最近父组件（也就是这里）
export default function ThinkingInReact() {
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <section className="panel">
      <h2>任务3 · Thinking in React 四步法</h2>
      <p className="lead">官网示例：可搜索的产品表格。搜索词与“只显示有货”两个状态，都在下面的父组件里。</p>

      <div className="grid-3-1">
        <div className="card">
          <SearchBar
            filterText={filterText}
            inStockOnly={inStockOnly}
            onFilterTextChange={setFilterText}
            onInStockOnlyChange={setInStockOnly}
          />
          <ProductTable products={PRODUCTS} filterText={filterText} inStockOnly={inStockOnly} />
        </div>

        <div className="card">
          <h3>四步法结论</h3>
          <p className="step"><b>① 拆组件</b><br />FilterableProductTable → SearchBar + ProductTable → ProductCategoryRow + ProductRow</p>
          <p className="step"><b>② 静态版</b><br />用 PRODUCTS 写死 JSX，一行 state 都不写</p>
          <p className="step"><b>③ 找 state</b><br />会变的只有搜索词、是否只显示有货。过滤后的列表能算出来，<b>不是</b> state</p>
          <p className="step"><b>④ 定位置</b><br />两个 state 都放在 FilterableProductTable（两个子组件的共同最近父组件），再往下传 props + 回调</p>
          <p className="muted small">当前：搜索词「{filterText || "空"}」，只显示有货 = {inStockOnly ? "是" : "否"}</p>
        </div>
      </div>
    </section>
  );
}
