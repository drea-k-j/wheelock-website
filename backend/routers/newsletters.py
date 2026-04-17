from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import NewslettersSection
from schemas import SectionCreate

router = APIRouter(prefix="/api/newsletters", tags=["newsletters"])

SUBSECTIONS = ["Sign-up"]


@router.get("/")
def get_newsletters(db: Session = Depends(get_db)):
    sections = db.query(NewslettersSection).all()
    return sections


@router.post("/")
def create_or_update_newsletters(section: SectionCreate, db: Session = Depends(get_db)):
    existing = db.query(NewslettersSection).filter(
        NewslettersSection.subsection == section.subsection
    ).first()
    
    if existing:
        existing.content = section.content
        db.commit()
        db.refresh(existing)
        return existing
    else:
        db_section = NewslettersSection(
            subsection=section.subsection,
            content=section.content
        )
        db.add(db_section)
        db.commit()
        db.refresh(db_section)
        return db_section
