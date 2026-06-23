from typing import List, TYPE_CHECKING  # ← добавляем TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.word import Word


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    # Связь с таблицей words
    words: Mapped[List["Word"]] = relationship(back_populates="user")

    # Вспомогательное поле для JWT
    @property
    def token_data(self):
        return {
            "id": self.id,
            "email": self.email
        }