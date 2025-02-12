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

@router.get("/lessons", response_model=List[Lesson], summary="Get all lessons", description="Returns paginated list of lessons with filtering and sorting options")
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

@router.get("/lessons/featured", response_model=List[Lesson], summary="Get featured lessons", description="Returns list of featured lessons")
async def list_featured_lessons(db: Client = Depends(get_db)):
    lessons = db.table('lessons').select('*').filter('is_featured', 'eq', True).execute()
    return [Lesson(**lesson) for lesson in lessons.data]

@router.get("/lessons/created", response_model=List[Lesson])
async def list_user_created_lessons(user_id: str, db: Client = Depends(get_db)):
    lessons = db.table('lessons').select('*').filter('creator_id', 'eq', user_id).execute()
    return [Lesson(**lesson) for lesson in lessons.data]

from uuid import UUID
from datetime import datetime

@router.post("/lessons", response_model=Lesson, status_code=201)
async def create_lesson(lesson_data: LessonCreate = Body(...)) -> Dict[str, Any]:
    """Create a new lesson."""
    db = get_supabase_client()
    try:
        # Convert to dict and add timestamps
        data = lesson_data.dict()
        data["created_at"] = datetime.utcnow().isoformat()
        data["updated_at"] = data["created_at"]
        
        # Ensure metadata is properly formatted as strings
        if 'metadata' in data:
            data['metadata'] = {str(k): str(v) for k, v in data['metadata'].items()}
        
        # Debug logging
        print("Creating lesson with data:")
        for key, value in data.items():
            print(f"  {key}: {value}")
        
        # Insert into database
        response = db.table('lessons').insert(data).execute()
        
        # Debug response
        print("Supabase response:")
        print(f"  Data: {response.data if hasattr(response, 'data') else 'No data'}")
        print(f"  Error: {response.error if hasattr(response, 'error') else 'No error'}")
        
        if response.error:
            print(f"Supabase error details: {response.error}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to create lesson: {response.error.message if hasattr(response.error, 'message') else str(response.error)}"
            )
            
        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="No data returned from database after insert"
            )
            
        return response.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Exception creating lesson:")
        print(f"  Error: {str(e)}")
        print(f"  Traceback: {traceback.format_exc()}")
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
