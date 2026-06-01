from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.order import OrderCreate, OrderResponse, OrderListResponse
from app.schemas.customer import CustomerResponse
from app.crud.order import get_orders, get_order, create_order as crud_create_order, delete_order as crud_delete_order
from app.crud.customer import get_customer

router = APIRouter()


@router.post("", response_model=OrderResponse, status_code=201)
async def create(data: OrderCreate, db: AsyncSession = Depends(get_db)):
    try:
        customer = await get_customer(db, data.customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        order = await crud_create_order(db, data)
        return _format_order_response(order)
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=list[OrderListResponse])
async def list_all(db: AsyncSession = Depends(get_db)):
    try:
        orders = await get_orders(db)
        result = []
        for o in orders:
            result.append(OrderListResponse(
                id=o.id,
                customer_name=o.customer.full_name if o.customer else None,
                items_count=len(o.items),
                total_amount=o.total_amount,
                status=o.status.value if hasattr(o.status, "value") else o.status,
                created_at=o.created_at,
            ))
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{order_id}", response_model=OrderResponse)
async def get_one(order_id: int, db: AsyncSession = Depends(get_db)):
    try:
        order = await get_order(db, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return _format_order_response(order)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{order_id}", status_code=200)
async def delete(order_id: int, db: AsyncSession = Depends(get_db)):
    try:
        order = await get_order(db, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        await crud_delete_order(db, order)
        return {"detail": "Order cancelled and stock restored"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def _format_order_response(order):
    return OrderResponse(
        id=order.id,
        customer_id=order.customer_id,
        customer_name=order.customer.full_name if order.customer else None,
        status=order.status.value if hasattr(order.status, "value") else order.status,
        total_amount=order.total_amount,
        created_at=order.created_at,
        items=[
            {
                "id": item.id,
                "product_id": item.product_id,
                "product_name": item.product.name if item.product else None,
                "product_sku": item.product.sku if item.product else None,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
            }
            for item in order.items
        ],
    )
