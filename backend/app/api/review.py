from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.word import Word
from app.schemas.word import WordForReviewResponse, WordUpdate, WordResponse
from app.services.spaced_repetition import (
    calculate_next_review,
    get_words_for_review,
    get_statistics
)

router = APIRouter(
    prefix="/review",
    tags=["Review"]
)


@router.get("/due", response_model=list[WordForReviewResponse])
def get_due_words(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получить слова для повторения (которые пора повторить)
    """
    words = get_words_for_review(db, current_user.id)
    return words


@router.post("/{word_id}")
def review_word(
    word_id: int,
    review_data: WordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Оценить слово при повторении
    """
    word = db.query(Word).filter(
        Word.id == word_id,
        Word.user_id == current_user.id
    ).first()
    
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    # Обновляем интервал
    word = calculate_next_review(word, review_data.rating)
    
    db.commit()
    db.refresh(word)
    
    return {"status": "updated", "word": word}


@router.get("/stats")
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получить статистику по словам
    """
    return get_statistics(db, current_user.id)