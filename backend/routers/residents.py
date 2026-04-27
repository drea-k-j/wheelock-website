from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import ResidentsSection
from schemas import SectionCreate

router = APIRouter(prefix="/api/residents", tags=["residents"])

SUBSECTIONS = ["Manual", "Application", "Key Dates"]


@router.get("")
def get_residents(db: Session = Depends(get_db)):
    sections = db.query(ResidentsSection).all()
    return sections


@router.post("")
def create_or_update_residents(section: SectionCreate, db: Session = Depends(get_db)):
    existing = db.query(ResidentsSection).filter(
        ResidentsSection.subsection == section.subsection
    ).first()
    
    if existing:
        existing.content = section.content
        db.commit()
        db.refresh(existing)
        return existing
    else:
        db_section = ResidentsSection(
            subsection=section.subsection,
            content=section.content
        )
        db.add(db_section)
        db.commit()
        db.refresh(db_section)
        return db_section
