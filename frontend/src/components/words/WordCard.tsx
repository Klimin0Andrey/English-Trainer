import React, { useState } from 'react';
import type { Word } from '../../types';

interface WordCardProps {
  word: Word;
  onDelete?: (id: number) => void;
  onKnow?: (id: number) => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, onDelete, onKnow }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative">
      <div
        className={`flip-card w-80 h-96 cursor-pointer mx-auto ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flip-card-inner relative w-full h-full">
          {/* Передняя сторона (английское слово) */}
          <div className="flip-card-front absolute w-full h-full bg-card rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-text">{word.english}</span>
            {word.transcription && (
              <span className="text-lg text-gray-500 mt-2">{word.transcription}</span>
            )}
            <span className="text-sm text-gray-400 mt-4">👆 Нажми для переворота</span>
          </div>

          {/* Задняя сторона (перевод) */}
          <div className="flip-card-back absolute w-full h-full bg-primary/10 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-text">{word.russian}</span>
            {word.transcription && (
              <span className="text-lg text-gray-500 mt-2">{word.transcription}</span>
            )}
            {word.examples && word.examples.length > 0 && (
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p className="font-semibold">Примеры:</p>
                {word.examples.map((example, i) => (
                  <p key={i} className="italic">"{example}"</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="flex justify-center gap-4 mt-4">
        {onKnow && (
          <button
            onClick={() => onKnow(word.id)}
            className="px-6 py-2 bg-success text-white rounded-lg hover:bg-green-600 transition"
          >
            ✅ Знаю
          </button>
        )}
        <button
          onClick={() => setFlipped(!flipped)}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition"
        >
          🔄 Перевернуть
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(word.id)}
            className="px-6 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition"
          >
            ❌ Удалить
          </button>
        )}
      </div>
    </div>
  );
};