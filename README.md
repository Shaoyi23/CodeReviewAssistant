# AI Code Review

基于 React + Vite 的现代化 Web 端 Code Review 工具，支持代码编辑、Diff 对比、AI 建议与评论讨论，界面风格参考 VS Code 与 GitHub Pull Request，暗色主题优先。

## 技术栈

| 类别     | 技术 |
|----------|------|
| 框架     | React 19 + TypeScript |
| 构建     | Vite 7 |
| 样式     | Tailwind CSS v4 |
| 状态管理 | Zustand |
| 代码编辑 | Monaco Editor（@monaco-editor/react） |

## 功能概览

- **三栏布局**：顶部导航 + 左侧文件树 + 中间编辑/ Diff + 右侧 AI / 评论
- **代码编辑**：Monaco 编辑器，多语言高亮、行号、minimap、代码折叠、多 Tab
- **Diff 对比**：Monaco DiffEditor，左右对比 / 内联切换，AI Summary、Accept / Reject
- **AI Review**：风险等级（High / Medium / Low）、问题列表、建议代码、Apply / Copy
- **评论系统**：行内评论、回复、Resolve、底部输入（占位 Markdown / @mention）
- **主题**：暗色默认，支持 Light / Dark 切换

## 快速开始

### 环境要求

- Node.js 18+
- npm / pnpm / yarn

### 安装与运行

```bash
# 安装依赖
npm install

# 开发
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

开发时在浏览器打开终端提示的本地地址即可。

## 项目结构

```
CodeReviewAssistant/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── main.tsx           # 入口
│   ├── App.tsx            # 根布局（三栏）
│   ├── index.css          # 全局样式与设计变量
│   ├── types.ts           # 公共类型
│   ├── store/
│   │   └── useAppStore.ts # 全局状态（Zustand）
│   └── components/
│       ├── layout/        # 布局组件
│       │   ├── TopNav.tsx
│       │   ├── FileTree.tsx
│       │   ├── CenterPanel.tsx
│       │   └── RightPanel.tsx
│       ├── editor/        # 编辑器与 Diff
│       │   ├── CodeEditor.tsx
│       │   └── DiffViewer.tsx
│       └── right/         # 右侧面板内容
│           ├── AIReviewTab.tsx
│           └── CommentsTab.tsx
```

## 设计说明

- **颜色**：主色 `#3b82f6`，背景/面板/边框及增删改状态色通过 CSS 变量统一管理（见 `src/index.css`）。
- **字体**：Inter（UI）、Fira Code（代码），由 Google Fonts 引入。
- **布局**：顶部导航 56px；左侧文件树 260px；右侧面板 320px；中间区域自适应。

## 后续扩展方向

- 行号悬停「+ Add Comment」与行内评论锚定
- 多文件 PR、多人协作
- GitHub API 集成
- AI 自动生成 Commit Message

## License

ISC
