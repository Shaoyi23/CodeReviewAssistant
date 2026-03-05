import { useEffect } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { FileTree } from "@/components/layout/FileTree";
import { CenterPanel } from "@/components/layout/CenterPanel";
import { RightPanel } from "@/components/layout/RightPanel";
import { useAppStore } from "@/store/useAppStore";

function App() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  return (
    <div className="flex h-screen flex-col bg-nav text-default">
      <TopNav />
      <div className="flex min-h-0 flex-1">
        <FileTree />
        <CenterPanel />
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
