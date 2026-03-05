import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { Comment } from "@/types";

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CommentsTab() {
  const comments = useAppStore((s) => s.comments);
  const updateCommentResolved = useAppStore((s) => s.updateCommentResolved);
  const addReply = useAppStore((s) => s.addReply);
  const [newBody, setNewBody] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");

  const sendNew = () => {
    if (!newBody.trim()) return;
    useAppStore.getState().addComment({
      id: "c-" + Date.now(),
      filePath: useAppStore.getState().currentFilePath ?? "",
      line: 1,
      author: "You",
      body: newBody,
      createdAt: new Date().toISOString(),
      resolved: false,
    });
    setNewBody("");
  };

  const sendReply = (commentId: string) => {
    if (!replyBody.trim()) return;
    addReply(commentId, {
      id: "r-" + Date.now(),
      filePath: "",
      line: 0,
      author: "You",
      body: replyBody,
      createdAt: new Date().toISOString(),
      resolved: false,
    });
    setReplyBody("");
    setReplyingTo(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-muted">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border border-default bg-panel p-3 transition-all duration-200"
            >
              <div className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/20 text-xs font-medium text-[var(--color-primary)]">
                  {c.author[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-default">
                      {c.author}
                    </span>
                    <span className="text-xs text-muted">
                      L{c.line} · {formatTime(c.createdAt)}
                    </span>
                    {c.resolved && (
                      <span className="rounded bg-[var(--color-add)]/20 px-1.5 py-0.5 text-[10px] text-[var(--color-add)]">
                        Resolved
                      </span>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-default">
                    {c.body}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateCommentResolved(c.id, !c.resolved)
                      }
                      className="text-xs text-muted hover:text-default"
                    >
                      {c.resolved ? "Unresolve" : "Resolve"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setReplyingTo(replyingTo === c.id ? null : c.id)
                      }
                      className="text-xs text-muted hover:text-default"
                    >
                      Reply
                    </button>
                  </div>
                  {replyingTo === c.id && (
                    <div className="mt-2 flex flex-col gap-2 rounded border border-default bg-nav p-2">
                      <textarea
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        placeholder="Write a reply..."
                        className="min-h-[60px] w-full resize-none rounded border border-default bg-panel px-2 py-1.5 text-sm text-default placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                        rows={2}
                      />
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyBody("");
                          }}
                          className="rounded border border-default px-2 py-1 text-xs text-muted"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => sendReply(c.id)}
                          className="btn-primary rounded px-2 py-1 text-xs"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                  {(c.replies?.length ?? 0) > 0 && (
                    <div className="mt-2 ml-4 space-y-2 border-l-2 border-default pl-3">
                      {c.replies!.map((r) => (
                        <div key={r.id} className="flex gap-2">
                          <div className="h-5 w-5 shrink-0 rounded-full bg-panel border border-default flex items-center justify-center text-[10px] text-muted">
                            {r.author[0]}
                          </div>
                          <div>
                            <span className="text-xs font-medium text-default">
                              {r.author}
                            </span>
                            <span className="ml-1 text-xs text-muted">
                              {formatTime(r.createdAt)}
                            </span>
                            <p className="text-xs text-default">{r.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="shrink-0 border-t border-default bg-panel p-3">
        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          placeholder="Add a comment... (Markdown, @mention)"
          className="mb-2 min-h-[72px] w-full resize-none rounded-lg border border-default bg-nav px-3 py-2 text-sm text-default placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          rows={3}
        />
        <button
          type="button"
          onClick={sendNew}
          className="btn-primary w-full rounded-lg py-2 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
