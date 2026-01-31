from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus
from backend.Config import settings

password = quote_plus(settings.password)


POSTGRESQL_DATABASE = f"{settings.database}://{settings.database_name}:{password}@{settings.host}/FastAPI"


engine = create_engine(POSTGRESQL_DATABASE)


SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()