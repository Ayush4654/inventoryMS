from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate]


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str | None = None
    product_sku: str | None = None
    quantity: int
    unit_price: Decimal

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    customer_name: str | None = None
    status: str
    total_amount: Decimal
    created_at: datetime
    items: list[OrderItemResponse] = []

    model_config = {"from_attributes": True}


class OrderListResponse(BaseModel):
    id: int
    customer_name: str | None = None
    items_count: int = 0
    total_amount: Decimal
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
