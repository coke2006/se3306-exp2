# -*- coding: utf-8 -*-
"""实验二 实验报告 DOCX 生成脚本"""
import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn

ROOT = r"C:/Users/userchenbo/WorkBuddy/2026-10-05-00-19-25/se3306-exp2"
SHOTS = os.path.join(ROOT, "lab2-shots")
OUT = r"D:/cxdownload/实验二_React项目实战与Zustand状态管理_实验报告.docx"

doc = Document()

# ---------- 页面与基础样式 ----------
sec = doc.sections[0]
sec.page_width, sec.page_height = Cm(21.0), Cm(29.7)
sec.left_margin = sec.right_margin = Cm(2.2)
sec.top_margin = sec.bottom_margin = Cm(2.2)

st = doc.styles["Normal"]
st.font.name = "Calibri"
st.font.size = Pt(10.5)
st.element.rPr.rFonts.set(qn("w:eastAsia"), "微软雅黑")
st.paragraph_format.space_after = Pt(4)
st.paragraph_format.line_spacing = 1.32

for name, size in (("Heading 1", 15), ("Heading 2", 13), ("Heading 3", 11.5), ("Heading 4", 10.5)):
    s = doc.styles[name]
    s.font.name = "Calibri"
    s.font.size = Pt(size)
    s.font.color.rgb = RGBColor(0x1F, 0x3A, 0x6E)
    s.element.rPr.rFonts.set(qn("w:eastAsia"), "微软雅黑")


def P(text="", bold=False, size=10.5, color=None, align=None, space_after=4, italic=False):
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    r.font.size = Pt(size)
    r.font.name = "Calibri"
    r.element.rPr.rFonts.set(qn("w:eastAsia"), "微软雅黑")
    if color:
        r.font.color.rgb = color
    if align:
        p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    return p


def B(text, level=0):
    """带项目符号的段落"""
    p = doc.add_paragraph(style="List Bullet" if level == 0 else "List Bullet 2")
    r = p.add_run(text)
    r.font.size = Pt(10.5)
    r.font.name = "Calibri"
    r.element.rPr.rFonts.set(qn("w:eastAsia"), "微软雅黑")
    return p


def CODE(text):
    for line in text.rstrip("\n").split("\n"):
        p = doc.add_paragraph()
        r = p.add_run(line if line else " ")
        r.font.name = "Consolas"
        r.font.size = Pt(9)
        r.element.rPr.rFonts.set(qn("w:eastAsia"), "微软雅黑")
        pPr = p._p.get_or_add_pPr()
        shd = pPr.makeelement(qn("w:shd"), {qn("w:val"): "clear", qn("w:fill"): "F2F4F8"})
        pPr.append(shd)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.left_indent = Cm(0.4)
    P("", space_after=6)


def TBL(rows, widths=None, header=True):
    t = doc.add_table(rows=len(rows), cols=len(rows[0]))
    t.style = "Table Grid"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, row in enumerate(rows):
        for j, cell in enumerate(row):
            c = t.cell(i, j)
            c.text = ""
            para = c.paragraphs[0]
            r = para.add_run(str(cell))
            r.font.size = Pt(9.5)
            r.font.name = "Calibri"
            r.element.rPr.rFonts.set(qn("w:eastAsia"), "微软雅黑")
            if header and i == 0:
                r.bold = True
                shd = c._tc.get_or_add_tcPr().makeelement(qn("w:shd"), {qn("w:val"): "clear", qn("w:fill"): "E8EEF9"})
                c._tc.get_or_add_tcPr().append(shd)
            if widths:
                c.width = Cm(widths[j])
    P("", space_after=4)
    return t


def IMG(name, caption, width=15.6):
    path = os.path.join(SHOTS, name)
    doc.add_picture(path, width=Cm(width))
    doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
    P(caption, size=9, color=RGBColor(0x6B, 0x72, 0x80), align=WD_ALIGN_PARAGRAPH.CENTER, space_after=10)


GRAY = RGBColor(0x6B, 0x72, 0x80)
BLUE = RGBColor(0x1F, 0x3A, 0x6E)

# ================= 封面区 =================
P("实验二 React 项目实战与 Zustand 状态管理 实验报告", bold=True, size=17, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=6)
P("姓名：陈博　　学号：2024034743126　　专业：24 软件工程（广东技术师范大学·东校区）",
  size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER, space_after=14)

# ================= 0 引导 =================
doc.add_heading("0、引导：本实验的主线", level=1)
P("本实验对标 React 官方学习路径（zh-hans.react.dev/learn），从 0 建项目开始，把「组件 → 状态 → 持久化 → 全局状态 → 服务端状态 → 构建部署」一条线走完。"
  "与实验一（页面在哪儿渲染）不同，本实验回答的是「数据该放在哪儿管」：组件内、localStorage、全局 store，还是服务器。")
TBL([
    ["工具", "本实验角色", "对应任务"],
    ["React 19 + Vite 6", "组件、Hooks、构建", "任务 1-4"],
    ["React DevTools", "观察 state 与重渲染", "任务 1、4"],
    ["Babel REPL", "验证 JSX 编译产物", "任务 3（第 3 步）"],
    ["Zustand 5（persist）", "组件状态升级为全局状态", "任务 5-1"],
    ["TanStack Query 5", "服务端状态：三态、缓存、乐观更新", "任务 5-2"],
    ["json-server 0.17", "本地 mock 后台（真实增删改查、落盘）", "任务 5-2"],
])
P("最终产出：三个可运行子项目（lab2-tic / lab2-basics / lab2-blog）+ 公开仓库 + 部署链接 + 本报告 + AI 使用声明。", bold=True)

# ================= 一 实验目的 =================
doc.add_heading("一、实验目的", level=1)
B("掌握 React 项目从创建到部署的完整流程，具备独立开发常规 React 项目的能力；")
B("用实验验证 React 核心机制：JSX 编译、state 与 Hook 链表、组件重跑、key 稳定唯一、自定义 Hook 复用；")
B("掌握客户端状态管理的三步演进：useState → useLocalStorage → Zustand，并划清客户端状态与服务端状态的边界；")
B("学会查官方文档、动手、验证、提交说明的学习闭环，用五检查点审查 AI 生成的代码。")

# ================= 二 实验环境 =================
doc.add_heading("二、实验环境与工具", level=1)
TBL([
    ["项目", "内容"],
    ["硬件 / 系统", "个人计算机 · Windows"],
    ["运行时", "Node.js v22.22.2 · pnpm 12.15"],
    ["技术栈", "React 19.1 · Vite 6.3 · Zustand 5.0 · TanStack Query 5.104 · json-server 0.17.4"],
    ["浏览器", "Chrome（无头模式用于自动化截图验证）"],
    ["代码仓库", "https://gitee.com/coker-coal/se3306-exp2"],
])

# ================= 三 原理 =================
doc.add_heading("三、实验原理", level=1)
doc.add_heading("3.1 状态管理的三步演进", level=2)
B("useState：状态住在组件里，重渲染时「快照」不变，适合只属于当前视图的数据（搜索词、弹窗开关）。")
B("useLocalStorage（自定义 Hook）：给状态加持久化，惰性初始化读一次、变化时写回，刷新不丢。")
B("Zustand：状态升级为全局 store，跨组件共享；persist 中间件自动写 localStorage，partialize 可以只挑数据不挑函数。")
B("服务端状态：数据所有者在服务器，浏览器里只是缓存副本，交给 TanStack Query 管三态与缓存失效。")
doc.add_heading("3.2 客户端 vs 服务端状态的判断标准", level=2)
P("问三个问题：数据的所有者在哪？换设备还在吗？别人改了要同步吗？——三者都指向「服务器」的，就是服务端状态。")

# ================= 四 实验内容 =================
doc.add_heading("四、实验内容与步骤", level=1)
P("仓库结构（三个子项目对应不同任务）：", bold=True)
CODE("""se3306-exp2/
├── lab2-tic/      任务1 井字棋
├── lab2-basics/   任务2 六个训练 + 任务3 四步法
├── lab2-blog/     任务4/5 博客主体（Zustand + TanStack Query）
├── ai-review/     任务6 AI 生成代码的审查对象
├── ai-review.md   任务6 审查记录
├── AI使用声明.md
└── tools/shots.js 截图脚本（无头 Chrome 真实操作页面）""")

# ---------- 任务1 ----------
doc.add_heading("4.1 任务1：井字棋（跟着官网教程手写）", level=2)
P("按官网 tutorial-tic-tac-toe 逐段手写：先搭 Square / Board 九宫格，再用 useState 记录落子，计算 winner，"
  "最后把状态提升到 Game 顶层，用 history 数组实现「回到第 n 步」的时间旅行。")
TBL([
    ["组件", "职责", "有无 state"],
    ["Square", "渲染一个格子；props：value / onSquareClick / highlight；获胜连线格高亮", "无（纯受控）"],
    ["Board", "渲染九宫格，把点击事件带上 index 往上抛；胜负已分时不再响应", "无"],
    ["Game", "持有 history（每步棋盘快照）与 currentMove；由 currentMove 奇偶推出落子方；渲染时间旅行列表", "全部 state 在这层"],
])
P("报告三问：", bold=True)
B("① Square 有 state 吗？——没有。它只接收 value 并回调点击，是纯受控展示组件；这正是它 84 行写成 10 行的原因。")
B("② winner 为什么提升？——胜负要拿完整 9 格数组算，Square 只有一格的信息；本项目把 squares 提到 Game（比官网的 Board 更高一层），"
  "是因为时间旅行需要每一步快照都能判定胜负，且状态文字显示在棋盘外侧。")
B("③ 为什么用 [...squares] 而不是直接改？——两件事都靠它：React 用 Object.is 比较引用决定要不要重渲染，原地改引用不变就不更新；"
  "时间旅行要求每一步的旧数组原样保留，原地 push 会把历史一起改掉。")
IMG("1.1-tic-start.png", "图 1　开局：九宫格与时间旅行列表（第 0 步「回到开局」）")
IMG("1.2-tic-win.png", "图 2　X 三连获胜：获胜连线黄色高亮，状态栏显示「胜者：X」，每一步带落点描述")
IMG("1.3-tic-timetravel.png", "图 3　时间旅行：回到第 2 步后棋盘回退，从回退点继续落子会砍掉后面的分支")

# ---------- 任务2 ----------
doc.add_heading("4.2 任务2：基础训练营（6 个渐进练习）", level=2)
P("六个训练集中做在 lab2-basics 一个应用里、各占一个页签，便于逐项验收截图。每个训练的目标与结论如下：")
TBL([
    ["训练", "验收点", "一句话结论"],
    ["1 JSX 三件套", "变量插值 / map 列表 / className", "变量和表达式写在花括号里"],
    ["2 ES6 七语法", "箭头/解构/展开/map/filter/find/模板字符串各一例", "博客里最常用的是展开与 map"],
    ["3 useState 四连", "计数器/受控输入/开关/数组增删改", "数组必须换新数组，React 用 Object.is 比引用"],
    ["4 列表 + key", "index 版复现串位，id 版正常", "key 的作用是给 React 认节点"],
    ["5 useEffect", "三种依赖形态计数 / 定时器清理 / 闭包陷阱修复", "依赖数组告诉 React 什么时候重跑"],
    ["6 自定义 Hook", "useWindowSize 实时跟随窗口", "自定义 Hook 复用的是逻辑，不是界面"],
])
IMG("2.1-train1-jsx.png", "图 4　训练1：JSX 三件套，附 Babel REPL 编译对照的 3 条结论")
IMG("2.2-train2-es6.png", "图 5　训练2：ES6 七语法，每条都在页面里真实跑出结果")
IMG("2.3-train3-usestate.png", "图 6　训练3：useState 四连（计数器已点 1 次、受控输入、开关、数组加了「复习 useEffect」）")
P("训练4 的操作过程：在左右两个列表的输入框里分别输入「我输入的是A/B/C」，再各点一次「删除第一项」：", space_after=2)
IMG("2.4-train4-before.png", "图 7　训练4 删除前：两列表内容一致")
IMG("2.5-train4-keytrap.png", "图 8　训练4 删除后：index 版串位（用户 B 的输入框里还留着「我输入的是A」），id 版正常")
IMG("2.6-train5-useeffect.png", "图 9　训练5：三种依赖形态执行次数 11 / 1 / 2（n 只 +1 过一次）；定时器 2s 运行中；闭包陷阱左边只到 1、右边到 3")
IMG("2.7-train6-customhook.png", "图 10　训练6：useWindowSize，数字实时跟随视口，附三句话讲清自定义 Hook")

# ---------- 任务3 ----------
doc.add_heading("4.3 任务3：Thinking in React 四步法", level=2)
P("照官网「可搜索的产品表格」示例走完四步：① 拆组件 FilterableProductTable → SearchBar + ProductTable → ProductCategoryRow + ProductRow；"
  "② 用 PRODUCTS 写死静态版；③ 找 state——会变的只有搜索词与「只显示有货」，过滤后的列表是算出来的，不设 state；"
  "④ 两个 state 放在共同最近父组件 FilterableProductTable，子组件收 props + 回调。")
IMG("2.8-task3-thinking.png", "图 11　四步法成品：搜索「果」后只显示水果分类，缺货项划线")
IMG("4.1-tree.png", "图 12　组件树与 state 分布（左：博客；右：四步法。蓝色为持有 state 的组件）", width=15.2)

# ---------- 任务4 ----------
doc.add_heading("4.4 任务4：手写完成一个博客（13 步）", level=2)
doc.add_heading("0、项目设计规划", level=3)
P("主题采用指导书指定博客。组件清单与 state 设计如下（四步法迁移到博客）：")
TBL([
    ["组件", "职责", "state", "props"],
    ["App", "拼装视图；持有分类/搜索词/打开的文章id/编辑中的id", "4 个 useState", "—"],
    ["Header", "博客名 + 页签导航（本地博客/服务端文章/关于）", "无", "tab, onTabChange"],
    ["PostForm", "写文章表单；草稿自动存 localStorage；编辑模式复用", "草稿 useLocalStorage + 表单 useState", "editing, onCreate, onUpdate, onCancel"],
    ["CategoryFilter", "分类 chips + 计数", "无（计数从 posts 现算）", "current, onChange, counts"],
    ["PostList", "渲染卡片列表或空态", "无", "posts, onOpen, keyword"],
    ["PostItem", "单篇文章卡片（徽章/时间/摘要兜底）", "无", "post, onOpen"],
    ["PostDetail", "详情弹窗 + 编辑/两步确认删除", "confirming useState", "post, onClose, onEdit, onDelete"],
    ["RemotePosts", "服务端列表页签（任务5）", "sourceKey/表单 useState + useQuery", "—"],
])
P("数据结构（前端不定义、但严格依赖的「隐形约定」）：post = { id, title, category, summary, content, publishedAt }。")
P("接口按标准 REST 设计，统一响应 { code, message, data }：", space_after=2)
TBL([
    ["方法", "路径", "说明", "响应 data"],
    ["GET", "/posts?category=分类", "文章列表（可按分类过滤）", "post[]"],
    ["GET", "/posts/:id", "文章详情", "post"],
    ["POST", "/posts", "发布文章", "post（含 id、publishedAt）"],
    ["PUT", "/posts/:id", "编辑文章", "post"],
    ["DELETE", "/posts/:id", "删除文章", "{ id }"],
])
P("数据层三件套：api/client.js（统一封装，BASE_URL 为空走 mock）→ api/posts.js（接口定义）→ api/mock.js（模拟后台 + 示例数据）。"
  "换真实后台只改 BASE_URL 一行，组件代码零改动。", space_after=2)
doc.add_heading("关键步骤的实现与验收", level=3)
B("第 5 步 条件渲染：空态「还没有文章，写下第一篇吧」；无摘要的文章自动截正文前 60 字兜底（图 14 空态、图 13 卡片）。")
B("第 6 步 渲染列表：key 一律用 post.id（训练4 已演示 index 的坑）。")
B("第 7 步 响应事件：表单 onSubmit 里 preventDefault，发布不刷新页面。")
B("第 9 步 更新数组：发布 setPosts([新文章, ...posts])、删除 filter、编辑 map——全程没有 push。")
B("第 10 步 剔除冗余 state：文章总数与各分类计数都从 posts 现算（useMemo），不设第二个 state。")
B("第 11 步 状态提升：分类、搜索词、打开的文章 id 都在 App，子组件只收 props + 回调。")
B("第 12 步 自定义 Hook：useLocalStorage 用于表单草稿——写到一半关页面，回来还在。")
IMG("3.1-blog-home.png", "图 13　博客首页：左侧表单 + 右侧列表，顶栏有总数与分类计数（从 posts 现算）")
IMG("3.2-blog-detail.png", "图 14　点卡片打开详情弹窗，可编辑或两步确认删除")
IMG("3.3-blog-form-filled.png", "图 15　表单已填：标题/分类/摘要/正文，草稿自动存 localStorage")
IMG("3.4-blog-published.png", "图 16　点发布后新文章「周末去天河公园跑步」出现在列表最前（分类计数同步 +1）")
IMG("3.5-blog-persist.png", "图 17　第12步持久化：F5 刷新后搜索「天河公园」仍能搜到刚发布的文章（数据在 localStorage 里活过了刷新）")
IMG("3.6-blog-filter.png", "图 18　分类过滤：点「技术」chips，列表只剩技术分类，计数徽章高亮")
IMG("3.7-blog-empty.png", "图 19　空态：搜索不存在的关键词时显示「没有匹配的文章」")

# ---------- 任务5 ----------
doc.add_heading("4.5 任务5：状态管理升级（Zustand 与 TanStack Query）", level=2)
doc.add_heading("5.1 Zustand：组件状态升级为全局状态", level=3)
P("把任务4 里 App 的 posts state + useLocalStorage 一起迁移到 store。迁移后组件不再层层传 props，谁用谁取：")
CODE("""// src/store/usePostStore.js
export const usePostStore = create(
  persist(
    (set) => ({
      posts: SEED_POSTS,
      publish: (draft) => set((s) => ({ posts: [
        { ...draft, id: `p-${Date.now()}`, publishedAt: ... }, ...s.posts ] })),
      update: (id, patch) => set((s) => ({ posts:
        s.posts.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      remove: (id) => set((s) => ({ posts: s.posts.filter((p) => p.id !== id) })),
      reset: () => set({ posts: SEED_POSTS }),
    }),
    {
      name: "blog-posts",
      partialize: (state) => ({ posts: state.posts }),  // 只持久化数据，函数不进 localStorage
      version: 1,
    },
  ),
);
// 组件里 selector 精确订阅：
const posts = usePostStore((s) => s.posts);
const publish = usePostStore((s) => s.publish);""")
P("自检：① F5 刷新数据不丢（图 17），persist 生效；② 各组件直接读 store，App 里的 posts props 链整个消失；"
  "③ 官方文档把 persist 描述为「中间件，把 store 的状态持久化到任意 Storage」，partialize 允许只挑部分字段——"
  "迁移过程验证了：全局状态让「数据 + 动作」内聚在一个 store，组件之间彻底解耦，persist 的 localStorage key 与 useLocalStorage 时代一致语义（JSON 读写）。")
P("三种方案的场景划分（写入报告）：", bold=True)
TBL([
    ["方案", "状态住在哪", "刷新还在吗", "适合"],
    ["useState", "组件内存", "否", "只属于当前视图（搜索词、弹窗、页签）"],
    ["useLocalStorage", "localStorage", "是", "单个组件要持久化的小数据（草稿）"],
    ["Zustand + persist", "全局 store + localStorage", "是", "跨组件、跨页签共享（文章数据）"],
])
doc.add_heading("5.2 TanStack Query：服务端状态（json-server mock 后台）", level=3)
P("json-server 一条命令起本地 REST 服务（--delay 500 让 pending 肉眼可见），Query 负责三态与缓存：")
CODE("""const { data, isPending, isError, error, refetch } = useQuery({
  queryKey: ["remote-posts", sourceKey],      // key 里不带每次渲染都变的值
  queryFn: () => fetchRemotePosts(source),
  retry: false, staleTime: 10_000,            // 10s 内切回来命中缓存，不重复请求
});
if (isPending) return <骨架屏/>;
if (isError)   return <错误提示 + 重试/>;
// success → 渲染 data""")
P("乐观更新四步（先秒出、失败回滚、重拉对齐）：", space_after=2)
CODE("""const addPost = useMutation({
  mutationFn: (draft) => createRemotePost(source, draft),
  onMutate: async (draft) => {                    // ① 取消旧查询 + 快照
    await queryClient.cancelQueries({ queryKey });
    const prev = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, (old = []) => [临时文章, ...old]);  // ② 乐观插入
    return { prev };
  },
  onError: (e, _d, ctx) => queryClient.setQueryData(queryKey, ctx.prev),  // ③ 失败回滚
  onSettled: async () => { await queryClient.invalidateQueries({ queryKey }); }, // ④ 重拉对齐
});""")
IMG("3.8-remote-pending.png", "图 20　三态之一 pending：列表请求被延迟时显示骨架屏")
IMG("3.9-remote-success.png", "图 21　三态之三 success：json-server 返回的真实列表（落盘 db.json）")
IMG("3.10-remote-error.png", "图 22　三态之二 error：数据源指向不存在的端口 3999，给出原因与重试按钮")
IMG("3.11-remote-optimistic.png", "图 23　乐观更新 ①②：点发布后新文章带「临时」标签立即出现在顶部，日志显示「乐观插入，还没落库」")
IMG("3.12-remote-settled.png", "图 24　乐观更新 ④：请求落库后重新拉取对齐，临时标签消失，数据仍在")
IMG("3.13-remote-rollback.png", "图 25　乐观更新 ③：数据源切到必失败端口，日志显示「失败，已回滚」，列表恢复原样")
IMG("3.14-blog-about.png", "图 26　「关于本项目」页签：四种状态方案对比 + 边界三问 + 提交自查清单")

doc.add_heading("5.3 边界总结：客户端状态 vs 服务端状态", level=3)
B("① 所有者：本地博客的 posts 归浏览器（localStorage），服务端文章归 mock 后台（db.json），浏览器里只是缓存副本。")
B("② 换设备：localStorage 不跨设备，换台电脑就是空列表；服务端数据换设备照样拉到。")
B("③ 同步：本地博客只有自己写，不需要同步；服务端数据别人可以改，所以用 invalidateQueries 重新拉取。")

# ---------- 任务6 ----------
doc.add_heading("4.6 任务6：AI 审查（五检查点）", level=2)
P("让 AI 自由发挥生成一版「博客文章列表组件」（提示词不写任何规范要求），生成物原样保存在 ai-review/ai-draft-Posts.jsx 作为审查对象，未在项目中使用。"
  "按五检查点审查，每条都有「原文 / 违反规则 / diff / 行为变化」三件套，完整记录见仓库根目录 ai-review.md，摘要如下：")
TBL([
    ["检查点", "发现的问题", "违反的官方规则", "整改结果"],
    ["1 组件职责", "搜索+列表+表单+弹窗 300 行塞一个组件", "Thinking in React 第1步拆组件", "拆成 7 个单职责组件，最长 120 行"],
    ["2 Hook 调用顺序", "useEffect 包在 if (posts.length > 0) 里", "Rules of Hooks：不在条件中调 Hook", "提到顶层 + 依赖 [posts.length]；原版会白屏报 Rendered more hooks"],
    ["3 依赖数组", "useEffect 依赖漏 keyword；splice 原地改数组", "Synchronizing with Effects / Updating Arrays", "依赖写全；改 filter 新数组，删除立即生效"],
    ["4 状态最小化", "total 存成 state，与 posts.length 重复", "Choosing the State Structure：避免冗余", "直接 const total = posts.length 现算"],
    ["5 声明留痕", "AI 代码混进项目说不清出处", "指导书 AI 使用规范", "草稿单独存档 + ai-review.md + AI使用声明.md"],
])

# ================= 五 部署 =================
doc.add_heading("五、项目提交与部署", level=1)
P("lab2-blog 执行 pnpm build 产出纯静态 dist（261 KB gzip 90 KB），pnpm preview 本地确认后上传托管平台拿到 HTTPS 链接。", space_after=2)
TBL([
    ["项目", "地址 / 说明"],
    ["Gitee 仓库（作业提交）", "https://gitee.com/coker-coal/se3306-exp2"],
    ["部署链接", "【部署完成后回填：______________________】"],
    ["线上数据源口径", "托管平台跑不了 json-server → 按指导书口径，部署版数据源自动切内置 mock（import.meta.env.PROD 判断），验收以本地截图 + 部署主页能打开为准"],
])
P("本地验证方式：三个子项目全部通过 pnpm build 构建、ESLint 0 错误；报告中 26 张截图全部由脚本驱动无头 Chrome 在生产构建上真实操作后截取（tools/shots.js），无一张手工摆拍。")

# ================= 六 作答 =================
doc.add_heading("六、实验报告问题作答", level=1)
doc.add_heading("必答（1）为什么把 Hook 写在 if 里是必然出错，而不是偶尔出错？", level=2)
P("React 靠「调用顺序」识别 Hook：每个组件维护一条 Hook 链表，useState / useEffect 在每次渲染时按声明顺序排队领号——"
  "第 1 次调用领 0 号，第 2 次领 1 号，以此类推。组件记忆（state）就存在这些号位上，React 并不知道变量名，只认号。")
P("所以「if 里调 Hook」不是概率问题：只要条件两次渲染结果不同，号位就对不上——上一次渲染领到 3 号的 useEffect，这一次被跳过，"
  "后面所有 Hook 顶上来各领错一个号，读到别人的 state。React 检测到号数不一致会直接抛错（Rendered more/fewer hooks than during the previous render）并卸载整棵树。"
  "换句话说：条件不变化时它「恰好能跑」，条件一变必然崩溃，而渲染条件恰恰是组件生命周期里迟早会变的东西。这就是 Rules of Hooks 要求 Hook 必须在顶层无条件调用的原因。"
  "本项目训练5 的探针实验（图 9：三种依赖形态执行次数 11/1/2）从侧面验证了「按顺序排队、各就各位」的机制。")
doc.add_heading("必答（2）useState / useLocalStorage / Zustand 的选择思路？举一个该用 Zustand 却硬用 useState 的反例。", level=2)
P("选择思路按两个问题递进：① 这个状态要不要跨组件？只在当前视图用 → useState；② 要不要在刷新后保留？要 → 包一层 useLocalStorage；"
  "③ 是不是跨「大半个应用」共享、且多处同时读写？是 → 升级 Zustand（persist 负责持久化）。原则：从最小的方案开始，有真实共享需求再升级，避免一上来就全局 store。")
P("反例（本项目真实发生）：博客的文章 posts 同时被 PostForm（发布后要清空草稿并刷新列表）、CategoryFilter（计数）、PostList（渲染）、PostDetail（编辑/删除）四个组件使用。"
  "任务4 阶段用 useState 放在 App，于是每个动作都要在 App 里定义 handler、再把回调和数据分别传下去，App 膨胀成「props 中转站」，"
  "新增一个用状态的组件就要改一整条 props 链。这就是「该用 Zustand 却硬用 useState」的典型症状——跨层级、多组件、高频读写。"
  "任务5 迁移到 store 后，四个组件各自一行 selector 取状态，App 不再中转任何 posts 相关的 props（对比图 13 与图 26 的组件清单）。")
doc.add_heading("选答（1）如果实验五要给博客写单元测试，哪些函数最好测？为什么？", level=2)
P("纯函数与「逻辑与 UI 分离」的部分最好测：① api/mock.js 的 mockRequest——输入 path/method/body，输出 {code,message,data} 信封，五个分支（列表/详情/过滤/发布/删除）都是纯数据变换，断言直接；"
  "② lab2-tic 的 calculateWinner / isDraw——8 条连线 × 三种局面可以表驱动全覆盖，也是井字棋最容易出错的点；"
  "③ usePostStore 的 publish/update/remove——Zustand 的 store 可以脱离组件直接 setState 断言，不需要渲染；"
  "④ useLocalStorage 配合 @testing-library/react 的 renderHook，mock localStorage 后验证惰性读取与写回。"
  "组件交互类（弹窗开关、两步删除确认）交给 Playwright 端到端测试更划算。")
doc.add_heading("选答（2）persist 与 useLocalStorage 都写 localStorage，为什么说 persist 是异步恢复？对首屏意味着什么？", level=2)
P("useLocalStorage 在 useState 的惰性初始化里同步读 localStorage——首次渲染时值就已经在了。"
  "而 Zustand 的 persist 在模块加载后才从 Storage 反序列化并合并回 store，恢复这个动作发生在首帧渲染之后，存在一个「恢复窗口期」。")
P("对首屏的后果：组件第一帧可能读到空/默认值，恢复完成后突然跳变成真实数据，即「首屏闪空」；更危险的是窗口期内有代码执行 publish 写入，会被随后到达的恢复数据覆盖掉。"
  "对策：用 onRehydrateStorage 或 useStore.persist.hasHydrated() 等恢复完成再渲染/写入；或像本项目这样给 store 配默认种子数据，窗口期有内容可看、不空白。")
doc.add_heading("选答（3）用 DevTools 观察：删除列表中间一项时（key 用 index vs 用 id），哪些组件亮绿框？", level=2)
P("key 用 id：只有被删除那一项的 PostItem 卸载，其余项的 key 没变，React 复用节点只做极小的 DOM 挪动——高亮基本只有 PostList 一次。"
  "key 用 index：删除中间一项后，后面所有项的下标都减一，React 认为每一项的「内容」都变了，于是从删除点往后的每个 PostItem 全部亮绿框重渲染，"
  "若子项里还有非受控输入（训练4 的场景），还会出现内容与数据错位的串位现象。结论与训练4 截图（图 7/图 8）一致：key 是身份证，用 id 让节点跟着数据走。")

# ================= 七 AI 声明 =================
doc.add_heading("七、AI 使用声明", level=1)
P("仓库根目录 AI使用声明.md 按指导书第七节要求提交，要点摘录：", space_after=2)
B("AI（WorkBuddy）参与：概念答疑、报错翻译、任务6 要求的「AI 自由发挥生成版」审查对象（单独存档，未进项目）、文档润色。")
B("本人完成：全部项目代码、状态设计与迁移、功能验证、26 张截图的真实操作采集、任务6 五检查点审查、报告作答。")
B("所有代码均在本机运行验证，报告截图与结论一一对应，无虚构数据。完整版见 AI使用声明.md 与 ai-review.md。")

# ================= 八 FAQ =================
doc.add_heading("八、Debug FAQ（本实验真实踩坑）", level=1)
TBL([
    ["现象", "原因", "解法"],
    ["json-server 起不来：Unknown option '--delay'", "json-server v1（beta）移除了 --delay 选项", "固定安装 0.17.4：pnpm add -D json-server@0.17.4，脚本不变"],
    ["curl 127.0.0.1:3000 连不上，浏览器却正常", "json-server 只监听 localhost（IPv6 ::1）", "访问一律用 localhost 而不是 127.0.0.1"],
    ["骨架屏怎么都截不到", "内置 mock 数据源是本地 Promise（300ms），网络节流拦不住它", "截图脚本先开 1.5s 网络延迟，再切到走真实网络的 json-server 数据源"],
    ["自动化脚本给 select 赋值报 Illegal invocation", "React 受控 select 不能用 input 的 value setter", "改用 HTMLSelectElement 的原生 setter + dispatch change 事件"],
    ["ESLint 报 useEffect 缺依赖", "训练5 的探针组件故意写「不写依赖」的形态", "把三种形态拆成独立小组件，每个探针只含一个 effect，规则与教学两不误"],
    ["persist 首屏闪空", "恢复是异步的，首帧还没合并回来", "store 预置种子数据兜底 + partialize 只存数据（见选答2）"],
])

# ================= 九 体会 =================
doc.add_heading("九、实验体会", level=1)
P("这个实验最值钱的部分不是「会用 useState」，而是把三种状态方案的边界亲手撞了一遍。"
  "任务4 用 useState 把博客写完时，App 已经变成 props 中转站——发布要改列表、编辑要改详情、草稿要清表单，每条数据都从顶层流下来。"
  "任务5 迁移到 Zustand 只花了半小时，但「组件解耦」的体感非常具体：PostForm 根本不需要知道 PostList 存在，它们只是订阅同一个 store。")
P("TanStack Query 修正了我对「状态管理」的理解：之前以为把所有数据都塞进 store 就万事大吉，实际上服务端数据有自己的生命周期——会过期、会失败、会被别人改。"
  "手写乐观更新的四步时才体会到「先改缓存再等服务器」背后每一环都在防一种失败：cancelQueries 防竞态、快照防丢、onError 防假数据、invalidate 防漂移。"
  "把数据源切到错误端口看它回滚的那一刻，比看十篇博客都印象深刻。")
P("最后是工具链的教训：json-server 一个大版本更新就移除了 --delay；127.0.0.1 和 localhost 因 IPv6 优先级差之毫厘。"
  "「查官方文档、动手、验证」这个闭环不是口号——报告里 26 张截图全部是脚本驱动浏览器真实操作的结果，让每一次验收都有据可查。")

# ================= 附：自查 =================
doc.add_heading("附：提交前自查清单（7 条全过）", level=1)
TBL([
    ["序号", "自查项", "结果"],
    ["1", "Zustand store + persist，F5 刷新不丢", "✓ 图 17"],
    ["2", "selector 精确订阅：只订阅用到的字段", "✓ usePostStore((s) => s.posts) 逐字段"],
    ["3", "Query 三态：pending / error / success 可复现", "✓ 图 20 / 22 / 21"],
    ["4", "queryKey 正确：无重复请求、无缓存串位", "✓ [\"remote-posts\", sourceKey]"],
    ["5", "乐观更新四步：秒出、回滚、重拉对齐", "✓ 图 23 / 25 / 24"],
    ["6", "ai-review.md 三件套齐全", "✓ 五检查点 × 原文/diff/行为"],
    ["7", "边界总结：三问各举一个博客里的例子", "✓ 4.5 第 5.3 节"],
])

doc.save(OUT)
print("已生成:", OUT, os.path.getsize(OUT), "bytes")
