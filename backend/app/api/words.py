from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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
    """
    Создать новое слово (для авторизованного пользователя)
    """
    # Если перевод не указан, получаем автоматически
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
    db: Session = Depends(get_db)
):
    """
    Получить все слова текущего пользователя
    """
    words = db.query(Word).filter(Word.user_id == current_user.id).all()
    return words


@router.delete("/{word_id}")
def delete_word(
    word_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Удалить слово
    """
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
    """
    Обновить слово
    """
    word = db.query(Word).filter(
        Word.id == word_id,
        Word.user_id == current_user.id
    ).first()
    
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    # Обновляем только переданные поля
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