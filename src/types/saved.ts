export interface SavedItem {
  id: string;
  content: string;
  type: 'prompt' | 'response';
  createdAt: number;
  tags: string[];
}

export type Tag = string;
