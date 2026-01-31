from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import FarmerProfile
from schema import FarmerCreate, FarmerResponse

router = APIRouter()

@router.post("/farmers", response_model=FarmerResponse)
def create_farmer(farmer: FarmerCreate, db: Session = Depends(get_db)):
    existing = db.query(FarmerProfile).filter(
        FarmerProfile.phone == farmer.phone
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    new_farmer = FarmerProfile(**farmer.dict())
    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)

    return new_farmer




@router.get("/farmers/{phone}", response_model=FarmerResponse)
def get_farmer(phone: str, db: Session = Depends(get_db)):
    farmer = db.query(FarmerProfile).filter(
        FarmerProfile.phone == phone
    ).first()

    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    return farmer

from typing import List

@router.get("/farmers", response_model=List[FarmerResponse])
def get_all_farmers(db: Session = Depends(get_db)):
    return db.query(FarmerProfile).all()

