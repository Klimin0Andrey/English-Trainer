import re
import string
from typing import List, Set
from sqlalchemy.orm import Session

from app.models.word import Word
from app.services.translator import translate_word
from app.schemas.text_import import WordCandidate


def extract_words(text: str) -> List[str]:
    """
    Извлекает слова из текста (убирает знаки препинания, приводит к нижнему регистру)
    """
    # Убираем знаки препинания и разбиваем на слова
    text = text.translate(str.maketrans('', '', string.punctuation))
    words = text.split()
    
    # Фильтруем: только буквенные слова длиной >= 2 символов
    words = [w.lower() for w in words if len(w) >= 2 and w.isalpha()]
    
    # Убираем дубликаты, сохраняя порядок
    seen: Set[str] = set()
    unique_words = []
    for w in words:
        if w not in seen:
            seen.add(w)
            unique_words.append(w)
    
    return unique_words


def process_text_import(
    db: Session,
    user_id: int,
    text: str,
    auto_add: bool = False
) -> List[WordCandidate]:
    """
    Обрабатывает импорт текста
    """
    # Извлекаем уникальные слова из текста
    words = extract_words(text)
    
    # Получаем существующие слова пользователя
    existing_words = db.query(Word).filter(Word.user_id == user_id).all()
    existing_set = {w.english.lower(): w for w in existing_words}
    
    candidates = []
    
    for word in words:
        # Проверяем, есть ли слово уже в словаре
        exists = word in existing_set
        
        # Если слово уже существует, пропускаем (или можно показать)
        if exists:
            candidates.append(WordCandidate(
                word=word,
                translation=existing_set[word].russian,
                transcription=existing_set[word].transcription or "",
                examples=existing_set[word].examples or [],
                exists=True,
                added=False
            ))
            continue
        
        # Для нового слова получаем перевод
        try:
            translation, transcription, examples = translate_word(word)
        except Exception as e:
            print(f"Error translating '{word}': {e}")
            translation = "[не удалось перевести]"
            transcription = ""
            examples = []
        
        candidates.append(WordCandidate(
            word=word,
            translation=translation,
            transcription=transcription,
            examples=examples,
            exists=False,
            added=False
        ))
        
        # Если auto_add включен, добавляем слово сразу
        if auto_add:
            new_word = Word(
                english=word,
                russian=translation,
                transcription=transcription,
                examples=examples,
                user_id=user_id
            )
            db.add(new_word)
            candidates[-1].added = True
    
    if auto_add:
        db.commit()
    
    return candidates