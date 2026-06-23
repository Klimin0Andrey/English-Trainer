from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.category import Category
from app.models.word import Word
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


@router.get("", response_model=list[CategoryResponse])
def get_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить все категории пользователя"""
    categories = db.query(Category).filter(Category.user_id == current_user.id).all()
    
    # Добавляем количество слов в каждой категории
    result = []
    for cat in categories:
        word_count = db.query(Word).filter(
            Word.categories.any(id=cat.id),
            Word.user_id == current_user.id
        ).count()
        result.append(CategoryResponse(
            id=cat.id,
            name=cat.name,
            description=cat.description,
            word_count=word_count
        ))
    
    return result


@router.post("", response_model=CategoryResponse)
def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Создать новую категорию"""
    # Проверяем, нет ли уже категории с таким именем
    existing = db.query(Category).filter(
        Category.user_id == current_user.id,
        Category.name == category_data.name
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    
    category = Category(
        name=category_data.name,
        description=category_data.description,
        user_id=current_user.id
    )
    
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return CategoryResponse(
        id=category.id,
        name=category.name,
        description=category.description,
        word_count=0
    )


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновить категорию"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if category_data.name is not None:
        # Проверяем, нет ли другой категории с таким именем
        existing = db.query(Category).filter(
            Category.user_id == current_user.id,
            Category.name == category_data.name,
            Category.id != category_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Category with this name already exists")
        category.name = category_data.name
    
    if category_data.description is not None:
        category.description = category_data.description
    
    db.commit()
    db.refresh(category)
    
    word_count = db.query(Word).filter(
        Word.categories.any(id=category.id),
        Word.user_id == current_user.id
    ).count()
    
    return CategoryResponse(
        id=category.id,
        name=category.name,
        description=category.description,
        word_count=word_count
    )


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Удалить категорию"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(category)
    db.commit()
    
    return {"status": "deleted"}


@router.post("/{category_id}/words/{word_id}")
def add_word_to_category(
    category_id: int,
    word_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Добавить слово в категорию"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    word = db.query(Word).filter(
        Word.id == word_id,
        Word.user_id == current_user.id
    ).first()
    
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    if word not in category.words:
        category.words.append(word)
        db.commit()
    
    return {"status": "added"}


@router.delete("/{category_id}/words/{word_id}")
def remove_word_from_category(
    category_id: int,
    word_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Удалить слово из категории"""
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    word = db.query(Word).filter(
        Word.id == word_id,
        Word.user_id == current_user.id
    ).first()
    
    if not word:
        raise HTTPException(status_code=404, detail="Word not found")
    
    if word in category.words:
        category.words.remove(word)
        db.commit()
    
    return {"status": "removed"}