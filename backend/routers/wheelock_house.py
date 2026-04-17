from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from database import get_db
from models import WheelockHouseSection
from schemas import SectionCreate, SectionResponse

router = APIRouter(prefix="/api/wheelock-house", tags=["wheelock-house"])


@router.get("/", response_model=list[SectionResponse])
def get_wheelock_house(db: Session = Depends(get_db)):
    return db.query(WheelockHouseSection).all()


@router.get("/{subsection}", response_model=SectionResponse)
def get_wheelock_house_subsection(subsection: str, db: Session = Depends(get_db)):
    db_section = db.query(WheelockHouseSection).filter(WheelockHouseSection.subsection == subsection).first()
    if not db_section:
        raise HTTPException(status_code=404, detail="Subsection not found")
    return db_section


@router.post("/", response_model=SectionResponse)
def create_or_update_wheelock_house(section: SectionCreate, db: Session = Depends(get_db)):
    db_section = db.query(WheelockHouseSection).filter(WheelockHouseSection.subsection == section.subsection).first()
    if db_section:
        db_section.content = section.content
        db_section.updated_at = datetime.now(timezone.utc)
    else:
        db_section = WheelockHouseSection(**section.dict())
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section
