from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.word import Word
from app.schemas.text_import import TextImportRequest, TextImportResponse
from app.services.text_processor import process_text_import
from app.services.translator import translate_word

router = APIRouter(
    prefix="/text",
    tags=["Text Import"]
)


@router.post("/import", response_model=TextImportResponse)
def import_text(
    request: TextImportRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Импортировать слова из текста
    """
    if not request.text or len(request.text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    candidates = process_text_import(
        db=db,
        user_id=current_user.id,
        text=request.text,
        auto_add=request.auto_add
    )
    
    total = len(candidates)
    existing = sum(1 for c in candidates if c.exists)
    new_words = sum(1 for c in candidates if not c.exists)
    added = sum(1 for c in candidates if c.added)
    
    return TextImportResponse(
        total_words=total,
        new_words=new_words,
        existing_words=existing,
        candidates=candidates
    )


@router.post("/import/add")
def add_selected_words(
    words: List[str],  # ← теперь просто список, без обёртки
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Добавить выбранные слова в словарь
    """
    added = []
    skipped = []
    
    for word in words:
        # Проверяем, есть ли уже
        existing = db.query(Word).filter(
            Word.user_id == current_user.id,
            Word.english.ilike(word)
        ).first()
        
        if existing:
            skipped.append(word)
            continue
        
        # Получаем перевод
        translation, transcription, examples = translate_word(word)
        
        new_word = Word(
            english=word,
            russian=translation,
            transcription=transcription,
            examples=examples,
            user_id=current_user.id
        )
        db.add(new_word)
        added.append(word)
    
    db.commit()
    
    return {
        "added": added,
        "skipped": skipped,
        "total": len(added)
    }