from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from app.core.config import get_settings
from app.supabase.client import get_supabase_client
from app.supabase.models import Lesson, LessonCreate, LessonUpdate, Category
from supabase import Client

router = APIRouter(tags=["lessons"])

def get_db() -> Client:
    return get_supabase_client()

@router.get("/lessons", response_model=List[Lesson])
async def list_lessons(
    search: Optional[str] = Query(None),
    sort: str = Query('newest'),
    limit: int = Query(10),
    offset: int = Query(0),
    category: Optional[str] = Query(None),
    db: Client = Depends(get_db)
):
    query = db.table('lessons').select('*')
    
    if search:
        query = query.or_(f'title.ilike.*{search}*', f'description.ilike.*{search}*')
    
    if sort == 'newest':
        query = query.order('created_at', desc=True)
    elif sort == 'oldest':
        query = query.order('created_at', desc=False)
    elif sort == 'price-low':
        query = query.order('price', desc=False)
    elif sort == 'price-high':
        query = query.order('price', desc=True)
    
    if category:
        query = query.join('lesson_category', 'lessons.id', '=', 'lesson_category.lesson_id') \
                      .join('categories', 'lesson_category.category_id', '=', 'categories.id') \
                      .filter('categories.name', 'eq', category) \
                      .select('*')
    
    lessons = query.limit(limit).offset(offset).execute()
    return [Lesson(**lesson) for lesson in lessons.data]

@router.get("/lessons/featured", response_model=List[Lesson])
async def list_featured_lessons(db: Client = Depends(get_db)):
    lessons = db.table('lessons').select('*').filter('is_featured', 'eq', True).execute()
    return [Lesson(**lesson) for lesson in lessons.data]

@router.get("/lessons/created", response_model=List[Lesson])
async def list_user_created_lessons(user_id: str, db: Client = Depends(get_db)):
    lessons = db.table('lessons').select('*').filter('creator_id', 'eq', user_id).execute()
    return [Lesson(**lesson) for lesson in lessons.data]

from uuid import UUID

@router.post("/lessons", response_model=Lesson, status_code=201)
async def create_lesson(lesson_data: Dict[str, Any] = Body(...)) -> Dict[str, Any]:
    """Create a new lesson."""
    db = get_supabase_client()
    try:
        print(f"Creating lesson with data: {lesson_data}")  # Debug log
        
        # Validate creator_id is a valid UUID
        try:
            creator_id = UUID(lesson_data.get("creator_id", ""))
            lesson_data["creator_id"] = str(creator_id)
        except (ValueError, AttributeError, TypeError):
            raise HTTPException(
                status_code=400,
                detail="Invalid creator_id format. Must be a valid UUID."
            )
            
        response = db.table('lessons').insert(lesson_data).execute()
        if response.error:
            print(f"Supabase error: {response.error}")  # Debug log
            raise HTTPException(
                status_code=400,
                detail=f"Failed to create lesson: {response.error.message}"
            )
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Exception creating lesson: {str(e)}")  # Debug log
        raise HTTPException(
            status_code=500,
            detail=f"Error creating lesson: {str(e)}"
        )

@router.patch("/lessons/{id}", response_model=Lesson)
async def update_lesson(id: str, lesson_update: LessonUpdate, db: Client = Depends(get_db)):
    updated_lesson = db.table('lessons').update(lesson_update.dict(exclude_unset=True)).eq('id', id).execute()
    if not updated_lesson.data:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return Lesson(**updated_lesson.data[0])

@router.delete("/lessons/{id}", response_model=None)
async def delete_lesson(id: str, db: Client = Depends(get_db)):
    deleted_lesson = db.table('lessons').update({'deleted_at': datetime.utcnow()}).eq('id', id).execute()
    if not deleted_lesson.data:
        raise HTTPException(status_code=404, detail="Lesson not found")

@router.get("/lessons/{id}", response_model=Lesson)
async def get_lesson(id: str, db: Client = Depends(get_db)):
    lesson = db.table('lessons').select('*').eq('id', id).execute()
    if not lesson.data:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return Lesson(**lesson.data[0])
