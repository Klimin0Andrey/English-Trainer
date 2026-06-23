import React, { useState } from 'react';
import type { Word, WordUpdate } from '../../types';
import { EditWordModal } from './EditWordModal';

interface WordListProps {
  words: Word[];
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, data: WordUpdate) => Promise<void>;  // ← WordUpdate
}

export const WordList: React.FC<WordListProps> = ({ words, onDelete, onUpdate }) => {
  const [search, setSearch] = useState('');
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  const filteredWords = words.filter(word =>
    word.english.toLowerCase().includes(search.toLowerCase()) ||
    word.russian.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (word: Word) => {
    setEditingWord(word);
  };

  const handleCloseModal = () => {
    setEditingWord(null);
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Поиск слов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="bg-card rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Английский</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Русский</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Транскрипция</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-600">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredWords.map((word) => (
              <tr key={word.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-3 font-medium">{word.english}</td>
                <td className="px-6 py-3">{word.russian}</td>
                <td className="px-6 py-3 text-gray-500">{word.transcription || '-'}</td>
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
            ))}
          </tbody>
        </table>
        {filteredWords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {words.length === 0 ? 'Слов пока нет. Добавьте первое слово!' : 'Ничего не найдено'}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Всего: {filteredWords.length} из {words.length} слов
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