from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class WordCreate(BaseModel):
    english: str
    russian: str | None = None
    transcription: str | None = None
    examples: List[str] | None = None


class WordUpdate(BaseModel):
    """Для обновления статуса слова при повторении"""
    rating: str  # again, hard, good, easy


class WordResponse(BaseModel):
    id: int
    english: str
    russian: str
    transcription: str | None = None
    examples: List[str] | None = None
    user_id: int
    
    # Поля для интервального повторения
    strength: int
    interval_days: int
    next_review: datetime | None = None
    last_review: datetime | None = None
    review_count: int
    correct_count: int
    wrong_count: int

    model_config = {
        "from_attributes": True
    }


class WordForReviewResponse(BaseModel):
    """Слово для повторения с дополнительной информацией"""
    id: int
    english: str
    russian: str
    transcription: str | None = None
    examples: List[str] | None = None
    strength: int
    interval_days: int
    
    model_config = {
        "from_attributes": True
    }
    
class WordUpdate(BaseModel):
    """Обновление слова"""
    english: str | None = None
    russian: str | None = None
    transcription: str | None = None
    examples: List[str] | None = None