import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWords } from '../hooks/useWords';
import { reviewApi, type StatsResponse } from '../api/review';

export const Dashboard: React.FC = () => {
  const { words, loading } = useWords();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await reviewApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, [words]);

  // Убираем totalWords, так как она не используется
  // const totalWords = words.length;

  if (loading || statsLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📚 Мой прогресс</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="text-3xl font-bold text-primary">{stats?.total || 0}</div>
          <div className="text-gray-500">Всего слов</div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="text-3xl font-bold text-success">{stats?.learned || 0}</div>
          <div className="text-gray-500">Выучено</div>
          <div className="text-sm text-gray-400">
            {stats?.total ? Math.round((stats.learned / stats.total) * 100) : 0}%
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="text-3xl font-bold text-warning">{stats?.need_review || 0}</div>
          <div className="text-gray-500">Нужно повторить</div>
        </div>

        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="text-3xl font-bold text-primary">{stats?.accuracy || 0}%</div>
          <div className="text-gray-500">Точность</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/add"
          className="bg-primary text-white p-6 rounded-xl text-center hover:bg-indigo-600 transition"
        >
          <div className="text-4xl mb-2">➕</div>
          <div className="font-semibold">Добавить слово</div>
        </Link>

        <Link
          to="/study"
          className="bg-secondary text-white p-6 rounded-xl text-center hover:bg-purple-600 transition"
        >
          <div className="text-4xl mb-2">🃏</div>
          <div className="font-semibold">Карточки</div>
        </Link>

        <Link
          to="/words"
          className="bg-gray-700 text-white p-6 rounded-xl text-center hover:bg-gray-800 transition"
        >
          <div className="text-4xl mb-2">📖</div>
          <div className="font-semibold">Словарь</div>
        </Link>
      </div>
    </div>
  );
};