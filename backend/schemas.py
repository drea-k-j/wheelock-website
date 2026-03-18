from pydantic import BaseModel
from datetime import datetime


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


# About Section Schemas
class AboutSectionCreate(BaseModel):
    subsection: str
    content: str


class AboutSectionResponse(BaseModel):
    id: int
    subsection: str
    content: str
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Wheelock House Schemas
class WheelockHouseSectionCreate(BaseModel):
    subsection: str
    content: str


class WheelockHouseSectionResponse(BaseModel):
    id: int
    subsection: str
    content: str
    updated_at: datetime
    
    class Config:
        from_attributes = True
