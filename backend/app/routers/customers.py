from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.customer import CustomerCreate, CustomerResponse
from app.crud.customer import get_customers, get_customer, get_customer_by_email, create_customer, delete_customer

router = APIRouter()


@router.post("", response_model=CustomerResponse, status_code=201)
async def create(data: CustomerCreate, db: AsyncSession = Depends(get_db)):
    try:
        existing = await get_customer_by_email(db, data.email)
        if existing:
            raise HTTPException(status_code=400, detail=f"Customer with email '{data.email}' already exists")
        customer = await create_customer(db, data)
        return customer
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=list[CustomerResponse])
async def list_all(db: AsyncSession = Depends(get_db)):
    try:
        return await get_customers(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{customer_id}", response_model=CustomerResponse)
async def get_one(customer_id: int, db: AsyncSession = Depends(get_db)):
    try:
        customer = await get_customer(db, customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{customer_id}", status_code=200)
async def delete(customer_id: int, db: AsyncSession = Depends(get_db)):
    try:
        customer = await get_customer(db, customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        await delete_customer(db, customer)
        return {"detail": "Customer deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
