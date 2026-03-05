import { useState } from "react";
import { AIReviewTab } from "@/components/right/AIReviewTab";
import { CommentsTab } from "@/components/right/CommentsTab";

const WIDTH = 320;
type TabId = "ai" | "comments";

export function RightPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("ai");

  return (
    <aside
      className="flex shrink-0 flex-col border-l border-default bg-nav"
      style={{ width: WIDTH }}
    >
      <div className="flex shrink-0 border-b border-default bg-panel">
        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "ai"
              ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
              : "text-muted hover:text-default"
          }`}
        >
          AI Review
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("comments")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "comments"
              ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
              : "text-muted hover:text-default"
          }`}
        >
          Comments
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {activeTab === "ai" && <AIReviewTab />}
        {activeTab === "comments" && <CommentsTab />}
      </div>
    </aside>
  );
}
