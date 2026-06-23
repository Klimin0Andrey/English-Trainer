import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWords } from '../hooks/useWords';
import { WordCard } from '../components/words/WordCard';

export const Study: React.FC = () => {
  const { words, loading } = useWords();
  const [shuffledWords, setShuffledWords] = useState<typeof words>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardCount, setCardCount] = useState(0);
  const isFirstRender = useRef(true);
  const prevWordsLength = useRef(words.length);

  const shuffleArray = useCallback((array: typeof words) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const loadShuffledWords = useCallback(() => {
    if (words.length === 0) {
      setShuffledWords([]);
      setCurrentIndex(0);
      return;
    }

    const count = cardCount === 0 ? words.length : Math.min(cardCount, words.length);
    const selected = [...words].slice(0, count);
    const shuffled = shuffleArray(selected);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
  }, [words, cardCount, shuffleArray]);

  useEffect(() => {
    if (isFirstRender.current && words.length > 0) {
      isFirstRender.current = false;
      loadShuffledWords();
    }
  }, [words, loadShuffledWords]);

  useEffect(() => {
    if (prevWordsLength.current !== words.length && words.length > 0) {
      prevWordsLength.current = words.length;
      loadShuffledWords();
    }
  }, [words, loadShuffledWords]);

  useEffect(() => {
    if (!isFirstRender.current && words.length > 0) {
      loadShuffledWords();
    }
  }, [cardCount, words, loadShuffledWords]);

  const reshuffle = useCallback(() => {
    loadShuffledWords();
  }, [loadShuffledWords]);

  const handleNext = useCallback(() => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      reshuffle();
    }
  }, [currentIndex, shuffledWords.length, reshuffle]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    setCardCount(count);
  };

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">Нет слов для изучения</p>
        <p className="text-gray-400 mt-2">Добавьте первое слово</p>
      </div>
    );
  }

  if (shuffledWords.length === 0) {
    return <div className="text-center py-12">Загрузка карточек...</div>;
  }

  const currentWord = shuffledWords[currentIndex];
  const progress = ((currentIndex + 1) / shuffledWords.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🃏 Карточки</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Слов:</label>
          <select
            value={cardCount}
            onChange={handleCountChange}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={0}>Все ({words.length})</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Прогресс</span>
          <span>{currentIndex + 1} из {shuffledWords.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <WordCard word={currentWord} />

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          ◀ Предыдущая
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition"
        >
          {currentIndex < shuffledWords.length - 1 ? 'Следующая ▶' : '🔄 Перемешать и начать заново'}
        </button>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Показано: {shuffledWords.length} из {words.length} слов
        {cardCount > 0 && cardCount < words.length && ` (выбрано ${cardCount})`}
      </div>
    </div>
  );
};