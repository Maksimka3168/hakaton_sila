from pydantic import BaseModel, EmailStr


class AuthRequestModel(BaseModel):
    email: EmailStr
    password: str
