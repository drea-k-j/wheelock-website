from pydantic import BaseModel
from datetime import datetime
from typing import Optional


# Admin Schemas
class AdminLogin(BaseModel):
    username: str
    password: str


# Generic Section Schema (used by multiple routes)
class SectionCreate(BaseModel):
    subsection: str
    content: str


class SectionResponse(BaseModel):
    id: int
    subsection: str
    content: str
    pdf_url: Optional[str] = None
    updated_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Announcement Schemas
class AnnouncementCreate(BaseModel):
    title: str
    content: str
    is_featured: bool = False


class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    is_featured: bool
    
    class Config:
        from_attributes = True
