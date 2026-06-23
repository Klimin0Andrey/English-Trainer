from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.schemas.category import CategoryResponse


class WordCreate(BaseModel):
    english: str
    russian: str | None = None
    transcription: str | None = None
    examples: List[str] | None = None
    level: str | None = None



class WordResponse(BaseModel):
    id: int
    english: str
    russian: str
    transcription: Optional[str] = None
    examples: List[str] = []
    user_id: int
    strength: int
    interval_days: int
    next_review: Optional[datetime] = None
    last_review: Optional[datetime] = None
    review_count: int
    correct_count: int
    wrong_count: int
    level: Optional[str] = None
    categories: List[CategoryResponse] = []
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
    level: Optional[str] = None