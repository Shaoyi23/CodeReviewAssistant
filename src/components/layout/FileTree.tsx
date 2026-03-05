import { useCallback, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { FileNode } from "@/types";

const WIDTH = 260;

function StatusIcon({ status }: { status?: FileNode["status"] }) {
  if (!status || status === "unchanged") return null;
  const style =
    status === "added"
      ? "text-[var(--color-add)]"
      : status === "deleted"
        ? "text-[var(--color-delete)]"
        : "text-[var(--color-warning)]";
  const symbol = status === "added" ? "M+" : status === "deleted" ? "M−" : "M";
  return <span className={`ml-1 font-mono text-[10px] ${style}`}>{symbol}</span>;
}

function TreeNode({
  node,
  depth,
  selectedId,
  onSelect,
  onToggleFolder,
  search,
}: {
  node: FileNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string, path: string) => void;
  onToggleFolder: (id: string) => void;
  search: string;
}) {
  const isSelected = selectedId === node.id;
  const isFolder = node.type === "folder";
  const hasMatch = useMemo(() => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return node.name.toLowerCase().includes(q) || node.path.toLowerCase().includes(q);
  }, [search, node.name, node.path]);

  const filteredChildren = useMemo(() => {
    if (!node.children) return [];
    if (!search.trim()) return node.children;
    return node.children.filter((c) => {
      if (c.type === "folder") return true;
      return c.name.toLowerCase().includes(search.toLowerCase());
    });
  }, [node.children, search]);

  const visible = hasMatch || (isFolder && filteredChildren.length > 0);
  if (!visible) return null;

  return (
    <div className="select-none">
      <div
        className="group flex cursor-pointer items-center gap-1 rounded-md py-1 pr-2 transition-colors hover:bg-[var(--color-border)]"
        style={{ paddingLeft: 8 + depth * 16 }}
        onClick={() => {
          if (isFolder) onToggleFolder(node.id);
          else onSelect(node.id, node.path);
        }}
      >
        {isFolder ? (
          <span className="w-4 shrink-0 text-muted">
            {node.expanded ? "▼" : "▶"}
          </span>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <span
          className={`min-w-0 truncate text-sm ${
            isSelected ? "font-medium text-[var(--color-primary)]" : "text-default"
          }`}
        >
          {node.name}
        </span>
        <StatusIcon status={node.status} />
      </div>
      {isFolder && node.expanded &&
        filteredChildren.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            onSelect={onSelect}
            onToggleFolder={onToggleFolder}
            search={search}
          />
        ))}
    </div>
  );
}

export function FileTree() {
  const fileTree = useAppStore((s) => s.fileTree);
  const selectedFileId = useAppStore((s) => s.selectedFileId);
  const setSelectedFileId = useAppStore((s) => s.setSelectedFileId);
  const setCurrentFilePath = useAppStore((s) => s.setCurrentFilePath);
  const fileSearch = useAppStore((s) => s.fileSearch);
  const setFileSearch = useAppStore((s) => s.setFileSearch);
  const toggleFolder = useAppStore((s) => s.toggleFolder);
  const addTab = useAppStore((s) => s.addTab);

  const onSelect = useCallback(
    (id: string, path: string) => {
      setSelectedFileId(id);
      setCurrentFilePath(path);
      addTab({
        id,
        path,
        name: path.split("/").pop() ?? path,
        content: `// ${path}\n// Sample content for demo`,
        language: path.endsWith(".tsx") || path.endsWith(".ts") ? "typescript" : "javascript",
      });
    },
    [setSelectedFileId, setCurrentFilePath, addTab]
  );

  return (
    <aside
      className="flex shrink-0 flex-col border-r border-default bg-panel"
      style={{ width: WIDTH }}
    >
      <div className="border-b border-default p-2">
        <input
          type="text"
          placeholder="Search files..."
          value={fileSearch}
          onChange={(e) => setFileSearch(e.target.value)}
          className="w-full rounded-md border border-default bg-nav px-2 py-1.5 text-sm text-default placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {fileTree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            selectedId={selectedFileId}
            onSelect={onSelect}
            onToggleFolder={toggleFolder}
            search={fileSearch}
          />
        ))}
      </div>
    </aside>
  );
}
