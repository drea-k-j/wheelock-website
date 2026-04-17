from fastapi import APIRouter
from typing import Dict, List

router = APIRouter(prefix="/api/config", tags=["config"])

# Single source of truth for sections and subsections
SECTIONS_CONFIG = {
    "about": {
        "label": "About",
        "subsections": ["About", "History", "Leadership"]
    },
    "wheelock-house": {
        "label": "Wheelock House",
        "subsections": ["About", "Contact", "Reservations"]
    },
    "wheelock-weekend": {
        "label": "Wheelock Weekend",
        "subsections": ["Schedule", "Bios", "Campus Map", "Registration"]
    },
    "residents": {
        "label": "Residents",
        "subsections": ["Manual", "Application", "Key Dates"]
    },
    "newsletters": {
        "label": "Newsletters",
        "subsections": ["Sign-up"]
    }
}


@router.get("/sections")
def get_sections() -> Dict[str, Dict]:
    """
    Get all sections and their subsections.
    This is the single source of truth for navigation structure.
    Frontend should use this instead of hardcoding SUBSECTIONS_MAP.
    """
    return SECTIONS_CONFIG


@router.get("/sections/{section_key}")
def get_section(section_key: str) -> Dict:
    """Get a specific section's configuration by key."""
    if section_key not in SECTIONS_CONFIG:
        return {"error": f"Section '{section_key}' not found"}
    return SECTIONS_CONFIG[section_key]
