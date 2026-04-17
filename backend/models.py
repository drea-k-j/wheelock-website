from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime, timezone
from database import Base


class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Announcement(Base):
    __tablename__ = "announcements"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True)
    content = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_featured = Column(Boolean, default=False)


class AboutSection(Base):
    __tablename__ = "about_sections"
    
    id = Column(Integer, primary_key=True, index=True)
    subsection = Column(String(100), unique=True, index=True)
    content = Column(Text)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class WheelockHouseSection(Base):
    __tablename__ = "wheelock_house"
    
    id = Column(Integer, primary_key=True, index=True)
    subsection = Column(String(100), unique=True, index=True)
    content = Column(Text)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class WheelockWeekendSection(Base):
    __tablename__ = "wheelock_weekend"
    
    id = Column(Integer, primary_key=True, index=True)
    subsection = Column(String(100), unique=True, index=True)
    content = Column(Text)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class ResidentsSection(Base):
    __tablename__ = "residents"
    
    id = Column(Integer, primary_key=True, index=True)
    subsection = Column(String(100), unique=True, index=True)
    content = Column(Text)
    pdf_url = Column(String(500), nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class NewslettersSection(Base):
    __tablename__ = "newsletters"
    
    id = Column(Integer, primary_key=True, index=True)
    subsection = Column(String(100), unique=True, index=True)
    content = Column(Text)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
