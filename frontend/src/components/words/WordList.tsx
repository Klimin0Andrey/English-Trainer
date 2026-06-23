import React, { useState } from 'react';
import type { Word, WordUpdate } from '../../types';
import { EditWordModal } from './EditWordModal';

type SortOption = 'newest' | 'oldest' | 'az' | 'za';
type FilterOption = 'all' | 'learned' | 'not_learned';

interface WordListProps {
  words: Word[];
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, data: WordUpdate) => Promise<void>;
}

export const WordList: React.FC<WordListProps> = ({ words, onDelete, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  // Фильтрация слов
  const filteredWords = words
    .filter(word => {
      // Поиск по английскому, русскому и транскрипции
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        word.english.toLowerCase().includes(searchLower) ||
        word.russian.toLowerCase().includes(searchLower) ||
        (word.transcription && word.transcription.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;

      // Фильтр по выученности
      if (filterBy === 'learned') {
        return word.strength >= 90 && word.interval_days >= 30 && word.correct_count >= 5;
      }
      if (filterBy === 'not_learned') {
        return !(word.strength >= 90 && word.interval_days >= 30 && word.correct_count >= 5);
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.id - a.id; // предполагаем, что больший id = новее
        case 'oldest':
          return a.id - b.id;
        case 'az':
          return a.english.localeCompare(b.english);
        case 'za':
          return b.english.localeCompare(a.english);
        default:
          return 0;
      }
    });

  const handleEditClick = (word: Word) => {
    setEditingWord(word);
  };

  const handleCloseModal = () => {
    setEditingWord(null);
  };

  return (
    <div>
      {/* Верхняя панель с поиском и фильтрами */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Поиск слов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text"
        >
          <option value="newest">📅 Новые сверху</option>
          <option value="oldest">📅 Старые сверху</option>
          <option value="az">🔤 А→Я</option>
          <option value="za">🔤 Я→А</option>
        </select>

        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as FilterOption)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card text-text"
        >
          <option value="all">📚 Все слова</option>
          <option value="learned">✅ Выученные</option>
          <option value="not_learned">📖 В процессе</option>
        </select>
      </div>

      {/* Таблица слов */}
      <div className="bg-card rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-hover">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-secondary">Английский</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-secondary">Русский</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-secondary">Транскрипция</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-text-secondary">Статус</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-text-secondary">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredWords.map((word) => {
              const isLearned = word.strength >= 90 && word.interval_days >= 30 && word.correct_count >= 5;
              
              return (
                <tr key={word.id} className="hover:bg-hover transition">
                  <td className="px-6 py-3 font-medium text-text">{word.english}</td>
                  <td className="px-6 py-3 text-text">{word.russian}</td>
                  <td className="px-6 py-3 text-text-secondary">{word.transcription || '-'}</td>
                  <td className="px-6 py-3">
                    {isLearned ? (
                      <span className="px-2 py-1 bg-success/20 text-success rounded-full text-sm">✅ Выучено</span>
                    ) : (
                      <span className="px-2 py-1 bg-warning/20 text-warning rounded-full text-sm">📖 В процессе</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    {onUpdate && (
                      <button
                        onClick={() => handleEditClick(word)}
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(word.id)}
                        className="text-danger hover:text-red-700 transition"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredWords.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            {words.length === 0 ? 'Слов пока нет. Добавьте первое слово!' : 'Ничего не найдено'}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-text-secondary">
        Показано: {filteredWords.length} из {words.length} слов
      </div>

      {editingWord && onUpdate && (
        <EditWordModal
          key={editingWord.id}
          word={editingWord}
          isOpen={!!editingWord}
          onClose={handleCloseModal}
          onSave={onUpdate}
        />
      )}
    </div>
  );
};