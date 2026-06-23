import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWords } from '../hooks/useWords';
import { reviewApi, type StatsResponse } from '../api/review';
import { FadeIn } from '../components/common/FadeIn';
import { AnimatedList, AnimatedListItem } from '../components/common/AnimatedList';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

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

  if (loading || statsLoading) {
    return <LoadingSpinner />;
  }

  const statItems = [
    { label: 'Всего слов', value: stats?.total || 0, color: 'text-primary' },
    { label: 'Выучено', value: stats?.learned || 0, color: 'text-success', sub: stats?.total ? `${Math.round((stats.learned / stats.total) * 100)}%` : '0%' },
    { label: 'Нужно повторить', value: stats?.need_review || 0, color: 'text-warning' },
    { label: 'Точность', value: `${stats?.accuracy || 0}%`, color: 'text-primary' },
  ];

  return (
    <div>
      <FadeIn>
        <h1 className="text-3xl font-bold mb-6 text-text">📚 Мой прогресс</h1>
      </FadeIn>

      <AnimatedList className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statItems.map((item, index) => (
          <AnimatedListItem key={item.label}>
            <motion.div
              className="bg-card rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -4 }}
            >
              <motion.div
                className={`text-3xl font-bold ${item.color}`}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
              >
                {item.value}
              </motion.div>
              <div className="text-text-secondary">{item.label}</div>
              {item.sub && (
                <div className="text-sm text-text-secondary mt-1">{item.sub}</div>
              )}
            </motion.div>
          </AnimatedListItem>
        ))}
      </AnimatedList>

      <FadeIn delay={0.3}>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/add"
              className="block bg-primary text-white p-6 rounded-xl text-center hover:bg-indigo-600 transition"
            >
              <div className="text-4xl mb-2">➕</div>
              <div className="font-semibold">Добавить слово</div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/study"
              className="block bg-secondary text-white p-6 rounded-xl text-center hover:bg-purple-600 transition"
            >
              <div className="text-4xl mb-2">🃏</div>
              <div className="font-semibold">Карточки</div>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/words"
              className="block bg-gray-700 text-white p-6 rounded-xl text-center hover:bg-gray-800 transition"
            >
              <div className="text-4xl mb-2">📖</div>
              <div className="font-semibold">Словарь</div>
            </Link>
          </motion.div>
        </div>
      </FadeIn>
    </div>
  );
};