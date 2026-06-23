from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.quiz import QuizAnswer, QuizResult
from app.services.quiz import get_quiz_questions, check_quiz_answer

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"]
)


@router.get("/questions")
def get_questions(
    count: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Получить вопросы для викторины
    """
    questions = get_quiz_questions(db, current_user.id, count)
    
    if not questions:
        raise HTTPException(
            status_code=404,
            detail="Not enough words for quiz. Add at least 4 words."
        )
    
    return {
        "total": len(questions),
        "questions": questions
    }


@router.post("/answer", response_model=QuizResult)
def check_answer(
    answer: QuizAnswer,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Проверить ответ на вопрос
    """
    result = check_quiz_answer(db, answer.word_id, current_user.id, answer.selected)
    
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    
    return QuizResult(**result)