import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useWords } from '../hooks/useWords';
import { useCategories } from '../hooks/useCategories';
import { categoriesApi } from '../api/categories';

export const AddWord: React.FC = () => {
  const navigate = useNavigate();
  const { addWord } = useWords();
  const { categories } = useCategories();
  const [english, setEnglish] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
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
      const newWord = await addWord({ english: english.trim() });
      
      // Если выбрана категория, добавляем слово в неё
      if (selectedCategoryId && newWord) {
        await categoriesApi.addWord(selectedCategoryId, newWord.id);
      }
      
      setEnglish('');
      setSelectedCategoryId(null);
      navigate('/words');
    } catch {
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
          <label className="block text-sm font-semibold text-text-secondary mb-2">
            Английское слово *
          </label>
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="Например: apple"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-text-secondary mb-2">
            Категория (необязательно)
          </label>
          <select
            value={selectedCategoryId ?? ''}
            onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"
            disabled={loading}
          >
            <option value="">Без категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.word_count})
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-danger rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition disabled:opacity-50"
          >
            {loading ? 'Добавление...' : '💾 Сохранить'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-hover text-text rounded-lg hover:bg-border transition"
          >
            Отмена
          </button>
        </div>

        <div className="mt-4 text-sm text-text-secondary">
          💡 Просто введите слово на английском, перевод добавится автоматически
        </div>
      </form>
    </div>
  );
};