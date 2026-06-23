from pydantic import BaseModel
from typing import List, Optional


class TextImportRequest(BaseModel):
    """Запрос на импорт текста"""
    text: str
    auto_add: bool = False


class WordCandidate(BaseModel):
    """Слово-кандидат для добавления"""
    word: str
    translation: Optional[str] = None
    transcription: Optional[str] = None
    examples: List[str] = []
    exists: bool = False
    added: bool = False


class TextImportResponse(BaseModel):
    """Ответ на импорт текста"""
    total_words: int
    new_words: int
    existing_words: int
    candidates: List[WordCandidate]