
from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):

    full_name: str

    institution: str

    email: EmailStr

    password: str


class LoginRequest(BaseModel):

    email: EmailStr

    password: str