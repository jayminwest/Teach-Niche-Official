from pydantic import BaseModel as PydanticBaseModel
from typing import Optional
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
