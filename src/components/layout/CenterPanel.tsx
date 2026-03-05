import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { DiffViewer } from "@/components/editor/DiffViewer";

export function CenterPanel() {
  const openTabs = useAppStore((s) => s.openTabs);
  const activeTabId = useAppStore((s) => s.activeTabId);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const closeTab = useAppStore((s) => s.closeTab);
  const updateTabContent = useAppStore((s) => s.updateTabContent);
  const centerMode = useAppStore((s) => s.centerMode);
  const setCenterMode = useAppStore((s) => s.setCenterMode);
  const diffState = useAppStore((s) => s.diffState);
  const setDiffState = useAppStore((s) => s.setDiffState);

  const activeTab = useMemo(
    () => openTabs.find((t) => t.id === activeTabId),
    [openTabs, activeTabId]
  );

  const showDiff = centerMode === "diff" && diffState;
  const editorHeight = "calc(100vh - 56px - 36px)"; // nav + tab bar

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-panel">
      {/* Tabs + mode switch */}
      <div className="flex shrink-0 items-center gap-1 border-b border-default bg-panel px-2 py-1">
        {openTabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-1 rounded-t-md border border-b-0 px-3 py-1.5 text-sm transition-colors ${
              activeTabId === tab.id
                ? "border-default bg-nav text-default"
                : "border-transparent text-muted hover:bg-[var(--color-border)] hover:text-default"
            }`}
          >
            <button
              type="button"
              className="min-w-0 truncate font-mono"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
            <button
              type="button"
              className="shrink-0 rounded p-0.5 hover:bg-[var(--color-border)]"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              aria-label="Close tab"
            >
              ×
            </button>
          </div>
        ))}
        <div className="ml-2 flex gap-1 border-l border-default pl-2">
          <button
            type="button"
            onClick={() => setCenterMode("editor")}
            className={`rounded px-2 py-1 text-xs ${
              centerMode === "editor"
                ? "bg-[var(--color-primary)] text-white"
                : "text-muted hover:bg-[var(--color-border)]"
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => {
              if (diffState) {
                setDiffState(null);
                setCenterMode("editor");
              } else {
                setDiffState({
                  original: activeTab?.content ?? "// original",
                  modified: "// AI suggested fix\n" + (activeTab?.content ?? ""),
                  summary: "Suggested refactor for readability and type safety.",
                  language: activeTab?.language,
                });
                setCenterMode("diff");
              }
            }}
            className={`rounded px-2 py-1 text-xs ${
              centerMode === "diff"
                ? "bg-[var(--color-primary)] text-white"
                : "text-muted hover:bg-[var(--color-border)]"
            }`}
          >
            Diff
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="center-panel-content flex-1 overflow-hidden">
        {showDiff && diffState ? (
          <DiffViewer
            original={diffState.original}
            modified={diffState.modified}
            language={diffState.language}
            summary={diffState.summary}
            height={editorHeight}
            onAccept={() => {
              activeTabId && updateTabContent(activeTabId, diffState.modified);
              setDiffState(null);
              setCenterMode("editor");
            }}
            onReject={() => {
              setDiffState(null);
              setCenterMode("editor");
            }}
          />
        ) : activeTab ? (
          <CodeEditor
            value={activeTab.content}
            language={activeTab.language}
            readOnly={false}
            height={editorHeight}
            onChange={(content) =>
              activeTabId && updateTabContent(activeTabId, content)
            }
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            Open a file from the tree
          </div>
        )}
      </div>
    </div>
  );
}
