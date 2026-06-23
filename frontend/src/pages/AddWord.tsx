import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWords } from '../hooks/useWords';

export const AddWord: React.FC = () => {
  const navigate = useNavigate();
  const { addWord } = useWords();
  const [english, setEnglish] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!english.trim()) {
      setError('Введите английское слово');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addWord({ english: english.trim() });
      setEnglish('');
      navigate('/words');
    } catch {
      // ← убираем err, так как не используем
      setError('Не удалось добавить слово');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">➕ Добавить новое слово</h1>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Английское слово
          </label>
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="Например: apple"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-danger rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
          >
            {loading ? 'Добавление...' : '💾 Сохранить'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Отмена
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          💡 Просто введите слово на английском, перевод добавится автоматически
        </div>
      </form>
    </div>
  );
};