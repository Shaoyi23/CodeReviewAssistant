import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { AIIssue, RiskLevel } from "@/types";

const riskColors: Record<RiskLevel, string> = {
  high: "bg-[var(--color-delete)]/20 text-[var(--color-delete)]",
  medium: "bg-[var(--color-warning)]/20 text-[var(--color-warning)]",
  low: "bg-[var(--color-add)]/20 text-[var(--color-add)]",
};

export function AIReviewTab() {
  const aiIssues = useAppStore((s) => s.aiIssues);
  return (
    <div className="flex flex-col gap-3 overflow-y-auto p-3">
      {aiIssues.length === 0 ? (
        <p className="text-sm text-muted">Run AI Review to see suggestions.</p>
      ) : (
        aiIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))
      )}
    </div>
  );
}

function IssueCard({ issue }: { issue: AIIssue }) {
  const [expanded, setExpanded] = useState(true);

  const copyCode = () => {
    if (issue.suggestedCode) {
      navigator.clipboard.writeText(issue.suggestedCode);
    }
  };

  return (
    <div
      className="rounded-lg border border-default bg-panel p-3 transition-shadow hover:shadow-subtle"
      style={{ boxShadow: "var(--shadow-subtle)" }}
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left"
        onClick={() => setExpanded((e) => !e)}
      >
        <span
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${riskColors[issue.risk]}`}
        >
          {issue.risk}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-default">
          {issue.title}
        </span>
        <span className="shrink-0 text-muted">{expanded ? "▼" : "▶"}</span>
      </button>
      {expanded && (
        <div className="mt-2 space-y-2 border-t border-default pt-2">
          <p className="text-xs text-muted">{issue.description}</p>
          {issue.suggestedCode && (
            <div className="relative">
              <pre className="overflow-x-auto rounded border border-default bg-nav p-2 font-mono text-xs text-default">
                {issue.suggestedCode}
              </pre>
              <div className="mt-1 flex gap-1">
                <button
                  type="button"
                  onClick={copyCode}
                  className="rounded border border-default px-2 py-1 text-xs text-muted hover:bg-[var(--color-border)]"
                >
                  Copy
                </button>
                <button
                  type="button"
                  className="btn-primary rounded px-2 py-1 text-xs"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
