import React, { useState } from 'react';
import type { Word, WordUpdate } from '../../types';

interface EditWordModalProps {
  word: Word;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: WordUpdate) => Promise<void>;
}

export const EditWordModal: React.FC<EditWordModalProps> = ({
  word,
  isOpen,
  onClose,
  onSave,
}) => {
  const [english, setEnglish] = useState(word.english);
  const [russian, setRussian] = useState(word.russian);
  const [transcription, setTranscription] = useState(word.transcription ?? '');
  const [examples, setExamples] = useState(word.examples?.join('\n') ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(word.id, {
        english: english.trim(),
        russian: russian.trim(),
        // Если поле пустое → null (очищаем транскрипцию)
        transcription: transcription.trim() || null,
        examples: examples.split('\n').map(e => e.trim()).filter(Boolean),
      });
      onClose();
    } catch (err) {
      setError('Не удалось сохранить изменения');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">✏️ Редактировать слово</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Английское слово *
              </label>
              <input
                type="text"
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Перевод *
              </label>
              <input
                type="text"
                value={russian}
                onChange={(e) => setRussian(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Транскрипция
              </label>
              <input
                type="text"
                value={transcription}
                onChange={(e) => setTranscription(e.target.value)}
                placeholder="/ˈæp.əl/"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Примеры (каждый с новой строки)
              </label>
              <textarea
                value={examples}
                onChange={(e) => setExamples(e.target.value)}
                placeholder="She ate an apple."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-danger rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
              >
                {loading ? 'Сохранение...' : '💾 Сохранить'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Отмена
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};