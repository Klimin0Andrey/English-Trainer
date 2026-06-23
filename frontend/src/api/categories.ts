import api from './client';

export interface Category {
  id: number;
  name: string;
  description: string | null;
  word_count: number;
}

export interface CategoryCreate {
  name: string;
  description?: string;
}

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  create: async (data: CategoryCreate): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CategoryCreate>): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  addWord: async (categoryId: number, wordId: number): Promise<void> => {
    await api.post(`/categories/${categoryId}/words/${wordId}`);
  },

  removeWord: async (categoryId: number, wordId: number): Promise<void> => {
    await api.delete(`/categories/${categoryId}/words/${wordId}`);
  },
};