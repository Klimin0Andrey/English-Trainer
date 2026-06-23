import api from './client';

export interface StatsResponse {
  total: number;
  learned: number;
  need_review: number;
  strength_avg: number;
  total_reviews: number;
  accuracy: number;
}

export const reviewApi = {
  // Получить статистику
  getStats: async (): Promise<StatsResponse> => {
    const response = await api.get('/review/stats');
    return response.data;
  },
};