import api from './client';

export interface QuizQuestion {
  id: number;
  english: string;
  options: string[];
  correct_answer: string;
}

export interface QuizAnswer {
  word_id: number;
  selected: string;
}

export interface QuizResult {
  correct: boolean;
  correct_answer: string;
  strength_before: number;
  strength_after: number;
  message: string;
}

export const quizApi = {
  // Получить вопросы
  getQuestions: async (count: number = 10): Promise<{ total: number; questions: QuizQuestion[] }> => {
    const response = await api.get(`/quiz/questions?count=${count}`);
    return response.data;
  },

  // Ответить на вопрос
  answer: async (word_id: number, selected: string): Promise<QuizResult> => {
    const response = await api.post('/quiz/answer', { word_id, selected });
    return response.data;
  },
};