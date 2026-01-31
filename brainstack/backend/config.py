from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    database: str
    database_name: str
    user: str
    password: str
    host: str
    database_port: int
    db_name: str

    secret_key: str
    algorithm: str
    expire_time: int

    model_config = ConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
