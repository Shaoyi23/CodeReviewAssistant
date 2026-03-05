import { useRef } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
  value: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  height: string | number;
}

export function CodeEditor({
  value,
  language = "typescript",
  readOnly = false,
  onChange,
  height,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  return (
    <div className="h-full w-full" style={{ minHeight: 200 }}>
      <Editor
        height={height}
        defaultLanguage={language}
        value={value}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: true },
          lineNumbers: "on",
          folding: true,
          fontSize: 13,
          fontFamily: "Fira Code, monospace",
          scrollBeyondLastLine: false,
          padding: { top: 8 },
          renderLineHighlight: "line",
        }}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
        onChange={(v) => onChange?.(v ?? "")}
      />
    </div>
  );
}
