# AI 使用声明（实验二）

**姓名**：陈博　**学号**：2024034743126　**专业**：24 软件工程

## 使用工具

WorkBuddy（AI 编码助手）。

## AI 参与的部分

1. **概念答疑**：解释 Hook 链表与调用顺序、闭包陷阱、`persist` 中间件的 `partialize`、`queryKey` 的缓存语义等概念，官方文档原文均由本人到 zh-hans.react.dev / zustand.docs.pmnd.rs 逐一对照；
2. **报错翻译**：安装依赖、起 json-server 时的报错信息解读（如 json-server v1 移除了 `--delay` 选项，回退 0.17.4）；
3. **任务6 审查对象**：按指导书要求“让 AI 自由发挥生成一版组件”，生成物单独放在 `ai-review/ai-draft-Posts.jsx`，仅作为审查对象，未在项目中使用；
4. **文档整理**：本声明与 README 的文字润色。

## 本人独立完成的部分

- 全部项目代码的编写与修改（`lab2-tic/`、`lab2-basics/`、`lab2-blog/`），包括组件拆分、状态设计、Zustand store、TanStack Query 三态与乐观更新；
- 全部功能验证：26 张运行截图均由脚本驱动无头 Chrome 在本机真实操作页面后截取（`tools/shots.js`），persist 刷新、乐观更新回滚等行为均实际跑通；
- 任务6 的 5 检查点审查、diff 整理与整改验证（`ai-review.md`）；
- 实验报告的作答（必答、选答、体会）。

## 声明

除上述范围外，AI 未参与代码编写。所有代码均在本机运行验证过，报告中的截图与结论一一对应，无虚构数据。
