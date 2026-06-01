from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(..., max_length=255)
    sku: str = Field(..., max_length=100)
    price: Decimal = Field(..., max_digits=10, decimal_places=2, gt=0)
    quantity: int = Field(default=0, ge=0)


class ProductUpdate(BaseModel):
    name: str | None = Field(None, max_length=255)
    sku: str | None = Field(None, max_length=100)
    price: Decimal | None = Field(None, max_digits=10, decimal_places=2, gt=0)
    quantity: int | None = Field(None, ge=0)


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    price: Decimal
    quantity: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
