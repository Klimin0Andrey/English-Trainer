from pydantic import BaseModel
from typing import Optional, List


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    word_count: int = 0

    model_config = {
        "from_attributes": True
    }