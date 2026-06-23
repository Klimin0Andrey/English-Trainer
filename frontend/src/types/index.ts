import type { Category } from '../api/categories';

export interface User {
  id: number;
  email: string;
}

export interface Word {
  id: number;
  english: string;
  russian: string;
  transcription: string | null;
  examples: string[];
  user_id: number;
  strength: number;
  interval_days: number;
  next_review: string | null;
  last_review: string | null;
  review_count: number;
  correct_count: number;
  wrong_count: number;
  level: string | null;  // ← добавить
  categories?: Category[];
}

export interface WordCreate {
  english: string;
  russian?: string;
  transcription?: string;
  examples?: string[];
  level?: string;  // ← добавить
}

export interface WordUpdate {
  english?: string;
  russian?: string;
  transcription?: string | null;
  examples?: string[];
  level?: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}