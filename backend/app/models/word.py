from typing import TYPE_CHECKING
from datetime import datetime

from sqlalchemy import String, ForeignKey, JSON, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.category import word_category  # импортируем таблицу связи

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.category import Category


class Word(Base):
    __tablename__ = "words"

    id: Mapped[int] = mapped_column(primary_key=True)

    english: Mapped[str] = mapped_column(String(255), nullable=False)
    russian: Mapped[str] = mapped_column(String(255), nullable=False)
    transcription: Mapped[str] = mapped_column(String(255), nullable=True)
    examples: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    # Поля для интервального повторения
    strength: Mapped[int] = mapped_column(Integer, default=0)
    interval_days: Mapped[int] = mapped_column(Integer, default=1)
    next_review: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    last_review: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    correct_count: Mapped[int] = mapped_column(Integer, default=0)
    wrong_count: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped["User"] = relationship(back_populates="words")
    categories: Mapped[list["Category"]] = relationship(
        secondary=word_category,
        back_populates="words"
    )