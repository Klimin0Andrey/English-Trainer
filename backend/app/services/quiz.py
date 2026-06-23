import random
from sqlalchemy.orm import Session

from app.models.word import Word
from app.schemas.quiz import QuizQuestion
from app.services.spaced_repetition import calculate_next_review


def get_quiz_questions(db: Session, user_id: int, count: int = 10) -> list[QuizQuestion]:
    """
    Генерирует вопросы для викторины
    """
    # Получаем все слова пользователя
    all_words = db.query(Word).filter(Word.user_id == user_id).all()
    
    if len(all_words) < 4:
        # Если слов меньше 4, возвращаем то, что есть
        return []
    
    # Выбираем слова для вопросов (с наименьшей прочностью)
    words_for_quiz = sorted(all_words, key=lambda w: w.strength)[:count]
    
    questions = []
    for word in words_for_quiz:
        # Собираем варианты ответов
        options = [word.russian]
        
        # Добавляем 3 случайных неправильных варианта
        other_words = [w for w in all_words if w.id != word.id]
        if len(other_words) >= 3:
            wrong_options = random.sample(other_words, 3)
            options.extend([w.russian for w in wrong_options])
        else:
            # Если слов мало, добавляем заглушки
            fallback = ["слово", "перевод", "вариант"]
            for i in range(3 - len(other_words)):
                options.append(fallback[i])
        
        # Перемешиваем варианты
        random.shuffle(options)
        
        questions.append(QuizQuestion(
            id=word.id,
            english=word.english,
            options=options,
            correct_answer=word.russian
        ))
    
    return questions


def check_quiz_answer(db: Session, word_id: int, user_id: int, selected: str) -> dict:
    """
    Проверяет ответ пользователя и обновляет статистику
    """
    word = db.query(Word).filter(
        Word.id == word_id,
        Word.user_id == user_id
    ).first()
    
    if not word:
        return {"error": "Word not found"}
    
    is_correct = selected == word.russian
    strength_before = word.strength
    
    # Обновляем слово в зависимости от правильности
    if is_correct:
        word = calculate_next_review(word, "good")
        message = "✅ Правильно! Отлично!"
    else:
        word = calculate_next_review(word, "again")
        message = f"❌ Неправильно. Правильный ответ: {word.russian}"
    
    db.commit()
    db.refresh(word)
    
    return {
        "correct": is_correct,
        "correct_answer": word.russian,
        "strength_before": strength_before,
        "strength_after": word.strength,
        "message": message
    }