from fastapi import FastAPI
from farmer import router as farmer_router
from database import Base,engine
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="Farmer AI Backend",
    description="AI-based farmer query and SMS system",
    version="1.0.0"
)
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(farmer_router, prefix="/api")

@app.get("/")
def root():
    return {"status": "Farmer backend running"}
