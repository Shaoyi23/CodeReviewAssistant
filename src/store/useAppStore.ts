import { create } from "zustand";
import type {
  FileNode,
  CenterMode,
  OpenTab,
  DiffState,
  AIIssue,
  Comment,
} from "@/types";

type AppState = {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;

  projectName: string;
  branchName: string;
  currentFilePath: string | null;
  setProjectName: (v: string) => void;
  setBranchName: (v: string) => void;
  setCurrentFilePath: (v: string | null) => void;

  fileTree: FileNode[];
  setFileTree: (tree: FileNode[]) => void;
  toggleFolder: (id: string) => void;
  selectedFileId: string | null;
  setSelectedFileId: (id: string | null) => void;
  fileSearch: string;
  setFileSearch: (v: string) => void;

  openTabs: OpenTab[];
  activeTabId: string | null;
  addTab: (tab: OpenTab) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string | null) => void;
  updateTabContent: (id: string, content: string) => void;

  centerMode: CenterMode;
  setCenterMode: (mode: CenterMode) => void;
  diffState: DiffState | null;
  setDiffState: (state: DiffState | null) => void;

  aiReviewLoading: boolean;
  setAiReviewLoading: (v: boolean) => void;
  aiIssues: AIIssue[];
  setAiIssues: (issues: AIIssue[]) => void;

  comments: Comment[];
  addComment: (c: Comment) => void;
  updateCommentResolved: (id: string, resolved: boolean) => void;
  addReply: (commentId: string, reply: Comment) => void;
};

const defaultTree: FileNode[] = [
  {
    id: "src",
    name: "src",
    path: "src",
    type: "folder",
    expanded: true,
    children: [
      {
        id: "src/App.tsx",
        name: "App.tsx",
        path: "src/App.tsx",
        type: "file",
        status: "modified",
      },
      {
        id: "src/main.tsx",
        name: "main.tsx",
        path: "src/main.tsx",
        type: "file",
        status: "unchanged",
      },
      {
        id: "src/utils",
        name: "utils",
        path: "src/utils",
        type: "folder",
        expanded: false,
        children: [
          {
            id: "src/utils/format.ts",
            name: "format.ts",
            path: "src/utils/format.ts",
            type: "file",
            status: "added",
          },
        ],
      },
    ],
  },
  {
    id: "package.json",
    name: "package.json",
    path: "package.json",
    type: "file",
    status: "deleted",
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  theme: "dark",
  setTheme: (theme) => {
    set({ theme });
    document.documentElement.classList.toggle("light", theme === "light");
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    set({ theme: next });
    document.documentElement.classList.toggle("light", next === "light");
  },

  projectName: "CodeReviewAssistant",
  branchName: "feature/login-refactor",
  currentFilePath: "src/App.tsx",
  setProjectName: (v) => set({ projectName: v }),
  setBranchName: (v) => set({ branchName: v }),
  setCurrentFilePath: (v) => set({ currentFilePath: v }),

  fileTree: defaultTree,
  setFileTree: (fileTree) => set({ fileTree }),
  toggleFolder: (id) =>
    set((state) => ({
      fileTree: mapTree(state.fileTree, (node) =>
        node.id === id && node.type === "folder"
          ? { ...node, expanded: !node.expanded }
          : node
      ),
    })),
  selectedFileId: "src/App.tsx",
  setSelectedFileId: (id) => set({ selectedFileId: id }),
  fileSearch: "",
  setFileSearch: (v) => set({ fileSearch: v }),

  openTabs: [
    {
      id: "src/App.tsx",
      path: "src/App.tsx",
      name: "App.tsx",
      content: `function App() {\n  return (\n    <div className="min-h-screen">\n      <h1>Code Review</h1>\n    </div>\n  );\n}\nexport default App;`,
      language: "typescript",
    },
  ],
  activeTabId: "src/App.tsx",
  addTab: (tab) =>
    set((state) => ({
      openTabs: state.openTabs.some((t) => t.id === tab.id)
        ? state.openTabs
        : [...state.openTabs, tab],
      activeTabId: tab.id,
    })),
  closeTab: (id) =>
    set((state) => {
      const tabs = state.openTabs.filter((t) => t.id !== id);
      const nextActive =
        state.activeTabId === id
          ? tabs[0]?.id ?? null
          : state.activeTabId;
      return { openTabs: tabs, activeTabId: nextActive };
    }),
  setActiveTab: (id) => set({ activeTabId: id }),
  updateTabContent: (id, content) =>
    set((state) => ({
      openTabs: state.openTabs.map((t) =>
        t.id === id ? { ...t, content } : t
      ),
    })),

  centerMode: "editor",
  setCenterMode: (mode) => set({ centerMode: mode }),
  diffState: null,
  setDiffState: (diffState) => set({ diffState }),

  aiReviewLoading: false,
  setAiReviewLoading: (v) => set({ aiReviewLoading: v }),
  aiIssues: [
    {
      id: "1",
      title: "Avoid inline styles",
      description: "Prefer Tailwind or CSS classes for consistency and maintainability.",
      risk: "medium",
      suggestedCode: "className=\"min-h-screen bg-slate-950\"",
      line: 3,
    },
    {
      id: "2",
      title: "Missing error boundary",
      description: "Consider wrapping the app in an ErrorBoundary for production.",
      risk: "low",
      line: 1,
    },
  ],
  setAiIssues: (aiIssues) => set({ aiIssues }),

  comments: [
    {
      id: "c1",
      filePath: "src/App.tsx",
      line: 2,
      author: "Dev",
      body: "Should we add a loading state here?",
      createdAt: "2025-03-05T10:00:00Z",
      resolved: false,
      replies: [
        {
          id: "c1-r1",
          filePath: "src/App.tsx",
          line: 2,
          author: "Reviewer",
          body: "Good idea, I'll add it.",
          createdAt: "2025-03-05T10:15:00Z",
          resolved: false,
        },
      ],
    },
  ],
  addComment: (c) =>
    set((state) => ({ comments: [...state.comments, c] })),
  updateCommentResolved: (id, resolved) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === id ? { ...c, resolved } : c
      ),
    })),
  addReply: (commentId, reply) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...(c.replies ?? []), reply] }
          : c
      ),
    })),
}));

function mapTree(
  nodes: FileNode[],
  fn: (n: FileNode) => FileNode
): FileNode[] {
  return nodes.map((node) => {
    const next = fn(node);
    if (next.children) {
      return { ...next, children: mapTree(next.children, fn) };
    }
    return next;
  });
}
