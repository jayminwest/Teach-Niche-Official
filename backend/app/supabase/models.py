from pydantic import BaseModel as PydanticBaseModel, Field
from typing import Optional, List
from datetime import datetime

class BaseModel(PydanticBaseModel):
    """
    BaseModel serves as a base class for all database models.
    """
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

class Category(BaseModel):
    name: str

class LessonBase(BaseModel):
    title: str
    description: Optional[str]
    price: float
    content: Optional[str]
    content_url: Optional[str]
    thumbnail_url: Optional[str]
    vimeo_video_id: Optional[str]
    vimeo_url: Optional[str]
    is_featured: bool = False
    status: str = 'draft'
    categories: Optional[List[Category]] = []

class LessonCreate(LessonBase):
    pass

class LessonUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    price: Optional[float]
    content: Optional[str]
    content_url: Optional[str]
    status: Optional[str] = None
    is_featured: Optional[bool] = None
    categories: Optional[List[Category]] = []

class Lesson(LessonBase):
    id: str
    creator_id: str
    stripe_product_id: Optional[str]
    stripe_price_id: Optional[str]
    deleted_at: Optional[datetime]
    version: int

    class Config:
        orm_mode = True
