import api from './client';
import type { Word, WordCreate, WordUpdate } from '../types';



export const wordsApi = {
  // Получить все слова (для текущего пользователя)
  getAll: async (): Promise<Word[]> => {
    const response = await api.get('/words');
    return response.data;
  },

  // Создать слово (для текущего пользователя)
  create: async (data: WordCreate): Promise<Word> => {
    const response = await api.post('/words', data);
    return response.data;
  },

  // Обновить слово
  update: async (id: number, data: WordUpdate): Promise<Word> => {
    const response = await api.put(`/words/${id}`, data);
    return response.data;
  },

  // Удалить слово
  delete: async (id: number): Promise<void> => {
    await api.delete(`/words/${id}`);
  },
};