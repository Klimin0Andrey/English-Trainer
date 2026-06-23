import api from './client';

export interface WordCandidate {
  word: string;
  translation: string | null;
  transcription: string | null;
  examples: string[];
  exists: boolean;
  added: boolean;
}

export interface TextImportResponse {
  total_words: number;
  new_words: number;
  existing_words: number;
  candidates: WordCandidate[];
}

export const textImportApi = {
  // Импорт текста
  importText: async (text: string, autoAdd: boolean = false): Promise<TextImportResponse> => {
    const response = await api.post('/text/import', { text, auto_add: autoAdd });
    return response.data;
  },

  // Добавить выбранные слова
  addWords: async (words: string[]): Promise<{ added: string[]; skipped: string[]; total: number }> => {
    const response = await api.post('/text/import/add', words);
    return response.data;
  },
};