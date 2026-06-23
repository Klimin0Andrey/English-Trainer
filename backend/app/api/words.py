from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.word import Word
from app.schemas.word import WordCreate, WordResponse, WordUpdate
from app.services.translator import translate_word

router = APIRouter(
    prefix="/words",
    tags=["Words"]
)


@router.post("", response_model=WordResponse)
def create_word(
    word_data: WordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создать новое слово"""
    russian = word_data.russian
    transcription = word_data.transcription
    examples = word_data.examples

    if not russian:
        russian, transcription, examples = translate_word(word_data.english)

    word = Word(
        english=word_data.english,
        russian=russian,
        transcription=transcription,
        examples=examples,
        user_id=current_user.id
    )

    db.add(word)
    db.commit()
    db.refresh(word)

    return word


@router.get("", response_model=list[WordResponse])
def get_words(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    sort_by: str = "id",
    order: str = "desc",
    learned: bool | None = None,
    category: int | None = None,
    level: str | None = None
):
    """Получить все слова текущего пользователя с фильтрацией и сортировкой"""
    query = db.query(Word).filter(Word.user_id == current_user.id)
    
    # Фильтр по категории
    if category:
        query = query.filter(Word.categories.any(id=category))
    
    # Фильтр по выученности
    if learned is not None:
        if learned:
            query = query.filter(
                Word.strength >= 90,
                Word.interval_days >= 30,
                Word.correct_count >= 5
            )
        else:
            query = query.filter(
                ~(
                    (Word.strength >= 90) &
                    (Word.interval_days >= 30) &
                    (Word.correct_count >= 5)
                )
            )
    
    # Сортировка
    if sort_by == "english":
        order_by = Word.english.asc() if order == "asc" else Word.english.desc()
    elif sort_by == "russian":
        order_by = Word.russian.asc() if order == "asc" else Word.russian.desc()
    elif sort_by == "strength":
        order_by = Word.strength.asc() if order == "asc" else Word.strength.desc()
    elif sort_by == "next_review":
        order_by = Word.next_review.asc() if order == "asc" else Word.next_review.desc()
    else:
        order_by = Word.id.desc() if order == "desc" else Word.id.asc()
    
    query = query.order_by(order_by)
    
    # Подгружаем категории
    words = query.options(joinedload(Word.categories)).all()
    return words


@router.delete("/{word_id}")
def delete_word(
    word_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Удалить слово"""
    word = db.query(Word).filter(
        Word.id == word_id,
        Word.user_id == current_user.id
    ).first()

    if not word:
        raise HTTPException(status_code=404, detail="Word not found")

    db.delete(word)
    db.commit()

    return {"status": "deleted"}


@router.put("/{word_id}", response_model=WordResponse)
def update_word(
    word_id: int,
    word_data: WordUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновить слово"""
    word = db.query(Word).filter(
        Word.id == word_id,
        Word.user_id == current_user.id
    ).first()
    
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    if word_data.english is not None:
        word.english = word_data.english
    if word_data.russian is not None:
        word.russian = word_data.russian
    if word_data.transcription is not None:
        word.transcription = word_data.transcription
    if word_data.examples is not None:
        word.examples = word_data.examples
    
    db.commit()
    db.refresh(word)
    
    return word