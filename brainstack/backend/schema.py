from pydantic import BaseModel, EmailStr, conint, Field
from datetime import datetime
from typing import Optional, List

class ContactDetail(BaseModel):
    firstname: str
    secondname: str
    email: EmailStr
    subject: str
    message: str

class ProjectsDetail(BaseModel):
    ProjectName: str
    ProjectContent: str
    TechStcak: str
    GitHubLink: Optional[str] = None
    PreviewLink: Optional[str] = None
    ImageUrl: Optional[str] = None


class CommentUserOut(BaseModel):
    user_id: int
    username: str

    class Config:
        from_attributes = True


class CommentOut(BaseModel):
    id: int
    comment: str
    project_id: int
    comments_user: CommentUserOut
    
    class Config:
        from_attributes = True


class ProjectWithVotes(BaseModel):
    project_id: int
    ProjectName: str
    ProjectContent: str
    TechStcak: str
    GitHubLink: str | None
    PreviewLink: str | None
    ImageUrl: str | None
    project_votes: int
    project_comments: List[CommentOut]

    class Config:
        from_attributes = True


class Comments(BaseModel):
    project_id: int
    comment: str


class User(BaseModel):
    email: str
    username: str


class ShowUser(BaseModel):
    user_id: int
    email: str
    username: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id:int
    username:str


class TokenData(BaseModel):
    id: Optional[int] = None


class ProjectUpvote(BaseModel):
    project_id: int
    dir: conint(le=1)


class ProjectUpvoteCheck(BaseModel):
    project_id: int
    user_id: int