
from pydantic import BaseModel
from datetime import date
from typing import Optional

class FarmerCreate(BaseModel):
    farmername: str
    phone: str
    state: str
    district: str
    soil_type: Optional[str] = None
    preferred_language: Optional[str] = "en"
    current_crop: Optional[str] = None
    start_date: Optional[date] = None
    estimate_complete_date: Optional[date] = None
    weather_support_sms: Optional[bool] = True


class FarmerResponse(FarmerCreate):
    farmer_id: int

    class Config:
        orm_mode = True
