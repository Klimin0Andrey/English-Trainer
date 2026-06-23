import React, { useState } from 'react';
import { useWords } from '../hooks/useWords';
import { useCategories } from '../hooks/useCategories';
import { WordList } from '../components/words/WordList';
import { CategoryManager } from '../components/categories/CategoryManager';
import { wordsApi } from '../api/words';
import type { WordUpdate } from '../types';

export const Words: React.FC = () => {
  const { words, loading, deleteWord, loadWords } = useWords();
  const { categories, loadCategories } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const handleUpdate = async (id: number, data: WordUpdate) => {
    await wordsApi.update(id, data);
    await loadWords();
  };

  const handleCategoryChange = () => {
    loadCategories();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📖 Мой словарь</h1>
      
      {/* Управление категориями */}
      <div className="mb-6">
        <CategoryManager onCategoryChange={handleCategoryChange} />
      </div>

      {loading ? (
        <div className="text-center py-12">Загрузка...</div>
      ) : (
        <WordList
          words={words}
          onDelete={deleteWord}
          onUpdate={handleUpdate}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
        />
      )}
    </div>
  );
};