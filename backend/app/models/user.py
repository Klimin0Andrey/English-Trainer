from typing import List, TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.word import Word
    from app.models.category import Category


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    words: Mapped[List["Word"]] = relationship(back_populates="user")
    categories: Mapped[List["Category"]] = relationship(back_populates="user")

    @property
    def token_data(self):
        return {
            "id": self.id,
            "email": self.email
        }