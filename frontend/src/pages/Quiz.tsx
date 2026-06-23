/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { quizApi, type QuizQuestion, type QuizResult } from '../api/quiz';

export const Quiz: React.FC = () => {
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [finished, setFinished] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);

  const loadQuestions = async (count: number) => {
    setLoading(true);
    try {
      const data = await quizApi.getQuestions(count);
      const shuffled = [...data.questions].sort(() => Math.random() - 0.5);
      const shuffledWithOptions = shuffled.map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
      }));
      setShuffledQuestions(shuffledWithOptions);
      setCurrentIndex(0);
      setSelectedOption(null);
      setResult(null);
      setFinished(false);
      setScore({ correct: 0, wrong: 0 });
    } catch (error) {
      console.error('Failed to load questions:', error);
      setShuffledQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем вопросы при монтировании
  useEffect(() => {
    loadQuestions(questionCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = shuffledQuestions[currentIndex];
  const progress = shuffledQuestions.length > 0 
    ? ((currentIndex + 1) / shuffledQuestions.length) * 100 
    : 0;

  const handleSelect = async (option: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);

    try {
      const response = await quizApi.answer(currentQuestion.id, option);
      setResult(response);

      if (response.correct) {
        setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
      }
    } catch (error) {
      console.error('Failed to check answer:', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setResult(null);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = async () => {
    await loadQuestions(questionCount);
  };

  const handleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    setQuestionCount(count);
    loadQuestions(count);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-500">Загрузка вопросов...</div>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">Недостаточно слов для викторины</p>
        <p className="text-gray-400 mt-2">Добавьте минимум 4 слова</p>
      </div>
    );
  }

  if (finished) {
    const total = score.correct + score.wrong;
    const percentage = total > 0 ? Math.round((score.correct / total) * 100) : 0;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">🎉 Викторина завершена!</h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-success">{score.correct}</div>
              <div className="text-sm text-gray-500">Правильно</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-danger">{score.wrong}</div>
              <div className="text-sm text-gray-500">Неправильно</div>
            </div>
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">{percentage}%</div>
              <div className="text-sm text-gray-500">Точность</div>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-indigo-600 transition"
          >
            🔄 Начать заново
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎯 Викторина</h1>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Количество:</label>
          <select
            value={questionCount}
            onChange={handleCountChange}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Вопрос {currentIndex + 1} из {shuffledQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Как переводится "{currentQuestion.english}"?
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrect = result && option === currentQuestion.correct_answer;

            let bgColor = 'bg-white hover:bg-gray-50';
            if (isSelected && result) {
              bgColor = isCorrect ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
            } else if (result && option === currentQuestion.correct_answer) {
              bgColor = 'bg-green-100 border-green-500';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                disabled={selectedOption !== null}
                className={`w-full px-4 py-3 text-left border-2 rounded-lg transition ${bgColor} ${
                  selectedOption === option ? 'border-primary' : 'border-gray-200'
                } disabled:cursor-not-allowed`}
              >
                <span className="font-medium">
                  {String.fromCharCode(97 + index)}. {option}
                </span>
                {isSelected && result && (
                  <span className="float-right">
                    {isCorrect ? '✅' : '❌'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {result && (
          <div className={`mt-4 p-3 rounded-lg ${result.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {result.message}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4 text-sm">
          <span className="text-success">✅ {score.correct}</span>
          <span className="text-danger">❌ {score.wrong}</span>
        </div>

        {selectedOption !== null && (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition"
          >
            {currentIndex < shuffledQuestions.length - 1 ? 'Следующий →' : 'Завершить 🎉'}
          </button>
        )}
      </div>
    </div>
  );
};