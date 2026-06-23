import React, { useState } from 'react';
import { textImportApi, type WordCandidate } from '../api/textImport';
import { useWords } from '../hooks/useWords';

export const TextImport: React.FC = () => {
  const { loadWords } = useWords();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<WordCandidate[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<{ total: number; new: number; existing: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Введите текст для анализа');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await textImportApi.importText(text, false);
      setCandidates(response.candidates);
      setStats({
        total: response.total_words,
        new: response.new_words,
        existing: response.existing_words,
      });
      // По умолчанию выбираем все новые слова
      const newWords = response.candidates
        .filter(c => !c.exists)
        .map(c => c.word);
      setSelectedWords(new Set(newWords));
    } catch (err) {
      setError('Не удалось проанализировать текст');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWord = (word: string) => {
    const newSelection = new Set(selectedWords);
    if (newSelection.has(word)) {
      newSelection.delete(word);
    } else {
      newSelection.add(word);
    }
    setSelectedWords(newSelection);
  };

  const handleSelectAll = () => {
    const allNewWords = candidates
      .filter(c => !c.exists)
      .map(c => c.word);
    setSelectedWords(new Set(allNewWords));
  };

  const handleDeselectAll = () => {
    setSelectedWords(new Set());
  };

  const handleAddSelected = async () => {
    const wordsToAdd = Array.from(selectedWords);
    if (wordsToAdd.length === 0) {
      setError('Выберите слова для добавления');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await textImportApi.addWords(wordsToAdd);
      setSuccess(`Добавлено ${result.added.length} слов`);
      // Обновляем список слов
      await loadWords();
      // Обновляем статус добавленных слов в кандидатах
      setCandidates(prev =>
        prev.map(c => ({
          ...c,
          added: result.added.includes(c.word) ? true : c.added,
        }))
      );
      setSelectedWords(new Set());
    } catch (err) {
      setError('Не удалось добавить слова');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setCandidates([]);
    setSelectedWords(new Set());
    setStats(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📝 Импорт из текста</h1>

      {/* Ввод текста */}
      <div className="bg-card rounded-xl shadow-lg p-6 mb-6">
        <p className="text-gray-600 mb-4">
          Вставьте текст на английском языке. Система найдет все слова и предложит добавить их в словарь.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Вставьте текст сюда..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          disabled={loading}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50"
          >
            {loading ? 'Анализ...' : '🔍 Анализировать'}
          </button>
          <button
            onClick={handleClear}
            disabled={loading}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            Очистить
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-danger rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 text-success rounded-lg text-sm">
            {success}
          </div>
        )}
      </div>

      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-gray-500">Всего слов</div>
          </div>
          <div className="bg-card rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.new}</div>
            <div className="text-sm text-gray-500">Новых слов</div>
          </div>
          <div className="bg-card rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.existing}</div>
            <div className="text-sm text-gray-500">Уже в словаре</div>
          </div>
        </div>
      )}

      {/* Список слов */}
      {candidates.length > 0 && (
        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Найденные слова</h2>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="text-sm px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition"
              >
                Выбрать все
              </button>
              <button
                onClick={handleDeselectAll}
                className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Снять все
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 w-12">✓</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Слово</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Перевод</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {candidates.map((candidate) => {
                  const isSelected = selectedWords.has(candidate.word);
                  const isNew = !candidate.exists;
                  const isAdded = candidate.added;

                  return (
                    <tr
                      key={candidate.word}
                      className={`hover:bg-gray-50 transition ${
                        isAdded ? 'bg-green-50' : ''
                      }`}
                    >
                      <td className="px-4 py-2">
                        {isNew && !isAdded && (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleWord(candidate.word)}
                            className="w-4 h-4 text-primary rounded focus:ring-primary"
                          />
                        )}
                        {isAdded && <span className="text-green-500">✅</span>}
                        {!isNew && <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-2 font-medium">{candidate.word}</td>
                      <td className="px-4 py-2 text-gray-600">
                        {candidate.translation || '—'}
                        {candidate.transcription && (
                          <span className="text-sm text-gray-400 ml-2">
                            {candidate.transcription}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {isAdded ? (
                          <span className="text-green-500 text-sm">✅ Добавлено</span>
                        ) : isNew ? (
                          <span className="text-primary text-sm">Новое</span>
                        ) : (
                          <span className="text-gray-400 text-sm">Уже есть</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              Выбрано: {selectedWords.size} слов
            </div>
            <button
              onClick={handleAddSelected}
              disabled={loading || selectedWords.size === 0}
              className="px-6 py-2 bg-success text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            >
              {loading ? 'Добавление...' : `➕ Добавить выбранные (${selectedWords.size})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};