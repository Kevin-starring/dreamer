export interface TreeNode {
  name: string;
  toolId: string | null;
  useCase?: string;
  feasibility?: number;
  children?: TreeNode[];
}

export interface DecomposeResponse {
  root: TreeNode;
  source: 'live' | 'golden-cache';
  note?: string;
}

export interface PromptTemplate {
  useCase: string;
  tags: string[];
  prompt: string;
  steps: string[];
}

export interface Tool {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  url: string;
  why: string;
  prompts: PromptTemplate[];
}
