
from sqlalchemy import Column, Integer, String, TIMESTAMP, text,ForeignKey,URL
from database import Base
from sqlalchemy.orm import relationship

from sqlalchemy import Column, Integer, String, Boolean, Date, TIMESTAMP, text

class FarmerProfile(Base):
    __tablename__ = "farmer_details"

    farmer_id = Column(Integer, primary_key=True, index=True)
    farmername = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False, unique=True, index=True)

    state = Column(String(50), nullable=False)
    district = Column(String(50), nullable=False)

    soil_type = Column(String(50), nullable=True)
    preferred_language = Column(String(20), nullable=False, default="en")

    current_crop = Column(String(50), nullable=True)

    estimate_complete_date = Column(Date, nullable=True)

    weather_support_sms = Column(Boolean, default=True)

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("now()")
    )



