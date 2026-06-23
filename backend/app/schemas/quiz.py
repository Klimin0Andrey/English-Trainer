from pydantic import BaseModel
from typing import List, Optional


class QuizQuestion(BaseModel):
    """Вопрос для викторины"""
    id: int
    english: str
    options: List[str]  # 4 варианта перевода
    correct_answer: str


class QuizAnswer(BaseModel):
    """Ответ пользователя"""
    word_id: int
    selected: str  # выбранный вариант


class QuizResult(BaseModel):
    """Результат ответа"""
    correct: bool
    correct_answer: str
    strength_before: int
    strength_after: int
    message: str