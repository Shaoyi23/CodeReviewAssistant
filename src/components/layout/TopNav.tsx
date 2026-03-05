import { useAppStore } from "@/store/useAppStore";

const NAV_HEIGHT = 56;

export function TopNav() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const projectName = useAppStore((s) => s.projectName);
  const branchName = useAppStore((s) => s.branchName);
  const currentFilePath = useAppStore((s) => s.currentFilePath);
  const setAiReviewLoading = useAppStore((s) => s.setAiReviewLoading);
  const aiReviewLoading = useAppStore((s) => s.aiReviewLoading);

  const runAiReview = () => {
    setAiReviewLoading(true);
    setTimeout(() => setAiReviewLoading(false), 2000);
  };

  return (
    <header
      className="flex shrink-0 items-center justify-between border-b border-default bg-nav px-4"
      style={{ height: NAV_HEIGHT }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-md font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              fontFamily: "var(--font-sans)",
            }}
          >
            AI
          </span>
          <span className="hidden text-sm font-medium text-default sm:inline">
            AI Code Review
          </span>
        </div>
        <div className="hidden min-w-0 shrink-0 items-center gap-2 border-l border-default pl-4 md:flex">
          <span className="truncate text-sm text-muted" title={projectName}>
            {projectName}
          </span>
          <span className="text-muted">/</span>
          <span
            className="truncate font-mono text-xs text-default"
            title={branchName}
          >
            {branchName}
          </span>
        </div>
        {currentFilePath && (
          <div className="hidden min-w-0 max-w-[200px] truncate font-mono text-xs text-muted lg:block">
            {currentFilePath}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={runAiReview}
          disabled={aiReviewLoading}
          className="btn-primary flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-70"
        >
          {aiReviewLoading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Running...
            </>
          ) : (
            "Run AI Review"
          )}
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-md border border-default bg-panel px-3 py-2 text-sm text-default transition-colors hover:bg-[var(--color-border)]"
          title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-panel border border-default text-sm font-medium text-muted"
          title="User"
        >
          U
        </div>
      </div>
    </header>
  );
}
