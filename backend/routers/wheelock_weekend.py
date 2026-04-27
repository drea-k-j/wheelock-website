from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import WheelockWeekendSection
from schemas import SectionCreate

router = APIRouter(prefix="/api/wheelock-weekend", tags=["wheelock_weekend"])

SUBSECTIONS = ["Schedule", "Bios", "Campus Map", "Registration"]


@router.get("")
def get_wheelock_weekend(db: Session = Depends(get_db)):
    sections = db.query(WheelockWeekendSection).all()
    return sections


@router.post("")
def create_or_update_wheelock_weekend(section: SectionCreate, db: Session = Depends(get_db)):
    existing = db.query(WheelockWeekendSection).filter(
        WheelockWeekendSection.subsection == section.subsection
    ).first()
    
    if existing:
        existing.content = section.content
        db.commit()
        db.refresh(existing)
        return existing
    else:
        db_section = WheelockWeekendSection(
            subsection=section.subsection,
            content=section.content
        )
        db.add(db_section)
        db.commit()
        db.refresh(db_section)
        return db_section
