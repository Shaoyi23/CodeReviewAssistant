import { useState } from "react";
import { DiffEditor } from "@monaco-editor/react";

interface DiffViewerProps {
  original: string;
  modified: string;
  language?: string;
  summary: string;
  onAccept?: () => void;
  onReject?: () => void;
  height: string | number;
}

export function DiffViewer({
  original,
  modified,
  language = "typescript",
  summary,
  onAccept,
  onReject,
  height,
}: DiffViewerProps) {
  const [inline, setInline] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-default bg-panel px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-muted">AI Summary</p>
          <p className="text-sm text-default">{summary || "No summary."}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setInline((i) => !i)}
            className="rounded-md border border-default bg-panel px-2 py-1 text-xs text-muted hover:bg-[var(--color-border)]"
          >
            {inline ? "Split" : "Inline"}
          </button>
          {onReject && (
            <button
              type="button"
              onClick={onReject}
              className="rounded-md border border-default px-3 py-1.5 text-xs font-medium text-default hover:bg-[var(--color-delete)]/20"
            >
              Reject
            </button>
          )}
          {onAccept && (
            <button
              type="button"
              onClick={onAccept}
              className="btn-primary rounded-md px-3 py-1.5 text-xs"
            >
              Accept Changes
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden transition-opacity duration-200">
        <DiffEditor
          height={height}
          original={original}
          modified={modified}
          language={language}
          theme="vs-dark"
          options={{
            renderSideBySide: !inline,
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: "Fira Code, monospace",
            renderLineHighlight: "line",
          }}
        />
      </div>
    </div>
  );
}
