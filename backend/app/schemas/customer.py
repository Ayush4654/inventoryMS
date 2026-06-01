from datetime import datetime
from pydantic import BaseModel, Field, EmailStr


class CustomerCreate(BaseModel):
    full_name: str = Field(..., max_length=255)
    email: EmailStr
    phone: str | None = Field(None, max_length=50)


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
