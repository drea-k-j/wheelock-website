from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
from models import AboutSection
from schemas import AboutSectionCreate, AboutSectionResponse

router = APIRouter(prefix="/api/about", tags=["about"])


@router.get("/", response_model=list[AboutSectionResponse])
def get_about(db: Session = Depends(get_db)):
    return db.query(AboutSection).all()


@router.get("/{subsection}", response_model=AboutSectionResponse)
def get_about_subsection(subsection: str, db: Session = Depends(get_db)):
    db_section = db.query(AboutSection).filter(AboutSection.subsection == subsection).first()
    if not db_section:
        raise HTTPException(status_code=404, detail="Subsection not found")
    return db_section


@router.post("/", response_model=AboutSectionResponse)
def create_or_update_about(section: AboutSectionCreate, db: Session = Depends(get_db)):
    db_section = db.query(AboutSection).filter(AboutSection.subsection == section.subsection).first()
    if db_section:
        db_section.content = section.content
        db_section.updated_at = datetime.utcnow()
    else:
        db_section = AboutSection(**section.dict())
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section
