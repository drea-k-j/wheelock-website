from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime
from database import Base


class Announcement(Base):
    __tablename__ = "announcements"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_featured = Column(Boolean, default=False)


class AboutSection(Base):
    __tablename__ = "about_sections"
    
    id = Column(Integer, primary_key=True, index=True)
    subsection = Column(String(100), unique=True, index=True)
    content = Column(Text)
    updated_at = Column(DateTime, default=datetime.utcnow)


class WheelockHouseSection(Base):
    __tablename__ = "wheelock_house"
    
    id = Column(Integer, primary_key=True, index=True)
    subsection = Column(String(100), unique=True, index=True)
    content = Column(Text)
    updated_at = Column(DateTime, default=datetime.utcnow)
