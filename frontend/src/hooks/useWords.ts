import { useState, useEffect } from 'react';
import { wordsApi } from '../api/words';
import type { Word, WordCreate } from '../types';

export function useWords() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // загрузка слов
  const loadWords = async () => {
    try {
      setLoading(true);
      const data = await wordsApi.getAll();
      setWords(data);
      setError(null);
    } catch (err) {
      setError('Failed to load words');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // загрузка при монтировании
  useEffect(() => {
    let alive = true;

    const init = async () => {
      try {
        setLoading(true);
        const data = await wordsApi.getAll();
        if (!alive) return;
        setWords(data);
        setError(null);
      } catch (err) {
        if (!alive) return;
        setError('Failed to load words');
        console.error(err);
      } finally {
        if (alive) setLoading(false);
      }
    };

    init();

    return () => {
      alive = false;
    };
  }, []);

  // добавление слова
  const addWord = async (wordData: WordCreate) => {
    try {
      const newWord = await wordsApi.create(wordData);
      setWords(prev => [...prev, newWord]);
      return newWord;
    } catch (err) {
      setError('Failed to add word');
      console.error(err);
      throw err;
    }
  };

  // удаление слова
  const deleteWord = async (id: number) => {
    try {
      await wordsApi.delete(id);
      setWords(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      setError('Failed to delete word');
      console.error(err);
      throw err;
    }
  };

  return {
    words,
    loading,
    error,
    loadWords,
    addWord,
    deleteWord,
  };
}