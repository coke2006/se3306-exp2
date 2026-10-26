# ai-review.md —— 任务6：AI 生成代码审查（按 5 检查点）

> 审查对象：`ai-review/ai-draft-Posts.jsx`（让 AI 自由发挥生成的“博客文章列表组件”，提示词未提任何规范要求）。
> 审查依据：React 官方文档 Rules of Hooks（zh-hans.react.dev/reference/rules/rules-of-hooks）、Rendering Lists、You Might Not Need an Effect。
> 留痕说明：AI 原始代码原样保留在 `ai-review/ai-draft-Posts.jsx`，未在项目中使用；项目实际使用的是整改后的 `lab2-blog/src/components/` 下各组件。

---

## 检查点 1：组件职责（是否超 200 行、多职责）

**AI 代码原文（问题片段）**

```jsx
export default function AiGeneratedPosts() {
  // 一个组件里同时做了：搜索框、列表、删除按钮、详情弹窗、表单……
  return (
    <div>
      <input ... />
      <ul>...</ul>
      {/* 弹窗、表单 JSX 共 300+ 行 */}
    </div>
  );
}
```

**违反规则**：官方 Thinking in React 第 1 步“拆组件”——单一职责；组件超过一屏就该按 UI 层级拆分。

**修改前后对比（diff）**

```diff
- export default function AiGeneratedPosts() { /* 搜索+列表+表单+弹窗 300 行 */ }
+ // 拆成五个文件，各管一件事
+ <Header /> <PostForm /> <CategoryFilter /> <PostList> <PostItem /> </PostList> <PostDetail />
```

**修改后运行行为变化**：原版改搜索框会让整棵 300 行组件树重跑；拆分后输入搜索词只有 App 与 PostList 重渲染，
PostForm 不再跟着重跑（表单里没输完的草稿不受影响）。文件长度从 300+ 行降到最长 120 行（PostForm）。

---

## 检查点 2：Hook 调用顺序（是否在 if / for / 嵌套函数里调 Hook）

**AI 代码原文（问题片段）**

```jsx
if (posts.length > 0) {
  useEffect(() => {
    document.title = `共 ${posts.length} 篇文章`;
  });
}
```

**违反规则**：Rules of Hooks 原文——“不要在循环、条件或嵌套函数中调用 Hook”。Hook 靠调用顺序在 Hook 链表里排队领号，
第一次渲染列表为空跳过了这个 useEffect，第二次渲染列表非空又调用了它，号对不上。

**修改前后对比（diff）**

```diff
- if (posts.length > 0) {
-   useEffect(() => { document.title = `共 ${posts.length} 篇文章`; });
- }
+ useEffect(() => {
+   document.title = posts.length > 0 ? `共 ${posts.length} 篇文章` : "陈博的博客";
+ }, [posts.length]);
```

**修改后运行行为变化**：原版从空列表变为非空的那一次更新，React 直接抛错
`Rendered more hooks than during the previous render`，整页白屏；整改后任何时刻都渲染出
“共 N 篇文章”的标题，空列表时显示默认标题，不再崩溃。
（对照实验：训练5 的截图 `2.6-train5-useeffect.png` 证明了“Hook 按声明顺序排队领号”——
三种依赖形态的执行次数 11 / 1 / 2 与理论完全一致。）

---

## 检查点 3：依赖数组（useEffect 依赖写全没？有没有闭包旧值？）

**AI 代码原文（问题片段）**

```jsx
// ① 依赖数组为空，却用了 keyword
useEffect(() => {
  const id = setTimeout(() => console.log("搜索词是：", keyword), 500);
  return () => clearTimeout(id);
}, []);

// ② 原地修改后 setPosts(posts)，引用没变
function handleDelete(id) {
  posts.splice(posts.findIndex((p) => p.id === id), 1);
  setPosts(posts);
}
```

**违反规则**：Synchronizing with Effects——“让 effect 响应每一个依赖的变化”；Updating Objects in State——
“state 是只读快照，必须换新对象/新数组”。

**修改前后对比（diff）**

```diff
- }, []);
+ }, [keyword]);            // ① 依赖写全

- function handleDelete(id) {
-   posts.splice(posts.findIndex((p) => p.id === id), 1);
-   setPosts(posts);
- }
+ function handleDelete(id) {
+   setPosts(posts.filter((p) => p.id !== id));   // ② 新数组
+ }
```

**修改后运行行为变化**：① 原版在输入框连打“react”三个字母，控制台打印的一直是初始值""（闭包捕获的旧值）；
补上依赖后打印 react / react2 / react3，与输入同步。② 原版点删除按钮界面毫无反应（引用没变，React 认为没更新）；
改 filter 后点击即删。本项目训练3/训练4 的截图（`2.3`、`2.5`）就是这套结论的可视化证据。

---

## 检查点 4：状态最小化（有没有冗余 state？）

**AI 代码原文（问题片段）**

```jsx
const [total, setTotal] = useState(0);
// ...
setTotal(data.length);
// JSX 里 <p>共 {total} 篇</p>
```

**违反规则**：Choosing the State Structure——“避免冗余 state”：能从已有 props/state 算出来的值，不要存。

**修改前后对比（diff）**

```diff
- const [total, setTotal] = useState(0);
- setTotal(data.length);
- <p>共 {total} 篇</p>
+ const total = posts.length;      // 直接算
+ <p>共 {total} 篇</p>
```

**修改后运行行为变化**：原版删除文章后若忘记同步 setTotal，会出现“列表 3 条、总数 4”的自相矛盾；
整改后总数永远与列表一致。本项目博客的分类计数就是照这个原则用 useMemo 从 posts 现算的（`App.jsx` 的 counts）。

---

## 检查点 5：AI 使用声明与审查留痕

**问题**：AI 直接生成的代码如果混进项目、不注明出处，交上去就说不清哪些是自己写的。

**整改**：
1. AI 草稿单独放在 `ai-review/ai-draft-Posts.jsx`，文件头注释标明“仅作审查对象，未在项目中使用”；
2. 本文件按 5 检查点留痕（原文 / 违反规则 / diff / 行为变化）；
3. 仓库根目录 `AI使用声明.md` 写明 AI 参与范围与人工验证部分；
4. 项目实际代码（`lab2-blog/src/`）均为按官方文档手写并逐条对照检查过的版本。

**行为验证**：整改进项目后，全部页面经无头 Chrome 端到端操作验证（截图见报告任务 4/5），
未出现检查点 2 的白屏崩溃、检查点 3 的删除无反应与搜索词打印滞后。
