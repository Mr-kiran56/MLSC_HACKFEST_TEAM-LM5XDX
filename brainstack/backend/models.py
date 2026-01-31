# backend/models/contact.py

from sqlalchemy import Column, Integer, String, TIMESTAMP, text,ForeignKey,URL
from backend.Database import Base
from sqlalchemy.orm import relationship



# FarmerProfile {
#   user_id
#   name
#   phone
#   state
#   district
#   soil_type
#   land_type
#   preferred_language
#   current_crop
#   start_date
#   languge
#   estimate_complete_date
# }


class CREATEUSER(Base):
    __tablename__="createuser"
    user_id = Column(Integer, primary_key=True, index=True,unique=True)
    username=Column(String,nullable=False)
    email=Column(String,nullable=False,unique=True)
    created_at=Column(TIMESTAMP(timezone=True),server_default=(('now()')))
    usercomments=relationship('COMMENTS',back_populates='comments_user')
    userprofileupvote=relationship('PROFILE_UPVOTE',back_populates='profile_upvote_ent')
    userprojectupvote=relationship('PROJECT_UPVOTE',back_populates='project_upvote')
    

class CONTACT(Base):
    __tablename__ = "contact"

    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    second_name = Column(String)
    email = Column(String, nullable=False, unique=True)
    subject = Column(String, nullable=False)
    message = Column(String, nullable=False)
    sent_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("now()"))
    

class PROJECTS(Base):
    __tablename__='projects'

    project_id=Column(Integer,primary_key=True,nullable=False,index=True)
    ProjectName=Column(String,nullable=False)
    ProjectContent=Column(String,nullable=False)
    TechStcak=Column(String,nullable=False)
    GitHubLink=Column(String,nullable=False)
    PreviewLink=Column(String)
    ImageUrl=Column(String,nullable=False)


class COMMENTS(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('createuser.user_id', ondelete='CASCADE'))
    project_id = Column(Integer, ForeignKey('projects.project_id', ondelete='CASCADE'))
    comment = Column(String, nullable=False)

    comments_user = relationship('CREATEUSER', back_populates='usercomments')


class PROFILE_UPVOTE(Base):
    __tablename__ = 'profile_upvote'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('createuser.user_id', ondelete='CASCADE'))

    profile_upvote_ent = relationship(
        'CREATEUSER',
        back_populates='userprofileupvote'
    )


class PROJECT_UPVOTE(Base):
    __tablename__ = 'project_upvotes'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('createuser.user_id', ondelete='CASCADE'))
    project_id = Column(Integer, ForeignKey('projects.project_id', ondelete='CASCADE'))

    project_upvote = relationship(
        'CREATEUSER',
        back_populates='userprojectupvote'
    )




    
