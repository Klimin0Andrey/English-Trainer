from typing import TYPE_CHECKING

from sqlalchemy import String, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.word import Word
    from app.models.user import User

word_category = Table(
    "word_category",
    Base.metadata,
    Column("word_id", ForeignKey("words.id", ondelete="CASCADE"), primary_key=True),
    Column("category_id", ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
)


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    words: Mapped[list["Word"]] = relationship(
        secondary=word_category,
        back_populates="categories"
    )

    user: Mapped["User"] = relationship(back_populates="categories")