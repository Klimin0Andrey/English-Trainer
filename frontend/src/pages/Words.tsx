import React from 'react';
import { useWords } from '../hooks/useWords';
import { WordList } from '../components/words/WordList';
import { wordsApi } from '../api/words';
import type { WordUpdate } from '../types';

export const Words: React.FC = () => {
  const { words, loading, deleteWord, loadWords } = useWords();

  const handleUpdate = async (id: number, data: WordUpdate) => {
    await wordsApi.update(id, data);
    await loadWords();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📖 Мой словарь</h1>
      {loading ? (
        <div className="text-center py-12">Загрузка...</div>
      ) : (
        <WordList
          words={words}
          onDelete={deleteWord}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};