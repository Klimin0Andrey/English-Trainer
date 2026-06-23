from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.models.word import Word


def calculate_next_review(word: Word, rating: str) -> Word:
    """
    Рассчитывает новый интервал повторения на основе оценки пользователя
    
    Оценки:
    - again: совсем не запомнил
    - hard: сложно, но запомнил
    - good: хорошо запомнил
    - easy: очень легко
    """
    # Базовая прочность
    if rating == "again":
        word.strength = max(0, word.strength - 20)
        word.interval_days = max(1, word.interval_days // 2)
        word.wrong_count += 1
        
    elif rating == "hard":
        word.strength = max(0, word.strength - 10)
        word.interval_days = max(1, word.interval_days)
        word.wrong_count += 1
        
    elif rating == "good":
        word.strength = min(100, word.strength + 5)
        word.interval_days = int(word.interval_days * 2)
        word.correct_count += 1
        
    elif rating == "easy":
        word.strength = min(100, word.strength + 15)
        word.interval_days = int(word.interval_days * 3)
        word.correct_count += 1
    
    # Обновляем даты
    word.last_review = datetime.utcnow()
    word.next_review = datetime.utcnow() + timedelta(days=word.interval_days)
    word.review_count += 1
    
    return word


def get_words_for_review(db: Session, user_id: int, limit: int = 20) -> list[Word]:
    """
    Получает слова для повторения:
    1. Сначала те, у которых истёк срок (next_review <= сейчас)
    2. Сортируем по силе (сначала слабые)
    3. Ограничиваем количество
    """
    now = datetime.utcnow()
    
    words = db.query(Word).filter(
        Word.user_id == user_id,
        Word.next_review <= now
    ).order_by(
        Word.strength.asc(),  # сначала слабые
        Word.next_review.asc()  # потом срочные
    ).limit(limit).all()
    
    return words


def get_words_for_quiz(db: Session, user_id: int, count: int = 10) -> list[Word]:
    """
    Получает слова для теста (выбор из 4 вариантов)
    Берём слова с наименьшей силой
    """
    words = db.query(Word).filter(
        Word.user_id == user_id
    ).order_by(
        Word.strength.asc(),
        Word.next_review.asc()
    ).limit(count).all()
    
    return words


def is_word_learned(word: Word) -> bool:
    """
    Проверяет, выучено ли слово
    """
    return (
        word.strength >= 90 and
        word.interval_days >= 30 and
        word.correct_count >= 5
    )


def get_statistics(db: Session, user_id: int) -> dict:
    """
    Получает статистику по словам пользователя
    """
    all_words = db.query(Word).filter(Word.user_id == user_id).all()
    total = len(all_words)
    
    if total == 0:
        return {
            "total": 0,
            "learned": 0,
            "need_review": 0,
            "strength_avg": 0,
            "total_reviews": 0,
            "accuracy": 0
        }
    
    now = datetime.utcnow()
    learned = sum(1 for w in all_words if is_word_learned(w))
    need_review = sum(1 for w in all_words if w.next_review and w.next_review <= now)
    strength_avg = sum(w.strength for w in all_words) / total
    
    total_reviews = sum(w.review_count for w in all_words)
    total_attempts = sum(w.correct_count + w.wrong_count for w in all_words)
    accuracy = (sum(w.correct_count for w in all_words) / total_attempts * 100) if total_attempts > 0 else 0
    
    return {
        "total": total,
        "learned": learned,
        "need_review": need_review,
        "strength_avg": round(strength_avg, 1),
        "total_reviews": total_reviews,
        "accuracy": round(accuracy, 1)
    }