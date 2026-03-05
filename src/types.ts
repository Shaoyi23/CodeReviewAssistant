export type FileStatus = "added" | "modified" | "deleted" | "unchanged";

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  status?: FileStatus;
  children?: FileNode[];
  expanded?: boolean;
}

export type CenterMode = "editor" | "diff";

export interface OpenTab {
  id: string;
  path: string;
  name: string;
  content: string;
  language?: string;
}

export interface DiffState {
  original: string;
  modified: string;
  summary: string;
  language?: string;
}

export type RiskLevel = "high" | "medium" | "low";

export interface AIIssue {
  id: string;
  title: string;
  description: string;
  risk: RiskLevel;
  suggestedCode?: string;
  line?: number;
}

export interface Comment {
  id: string;
  filePath: string;
  line: number;
  author: string;
  avatar?: string;
  body: string;
  createdAt: string;
  resolved: boolean;
  replies?: Comment[];
}
