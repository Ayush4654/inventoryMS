from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


async def get_customers(db: AsyncSession):
    result = await db.execute(select(Customer).order_by(Customer.id))
    return result.scalars().all()


async def get_customer(db: AsyncSession, customer_id: int):
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    return result.scalar_one_or_none()


async def get_customer_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(Customer).where(Customer.email == email))
    return result.scalar_one_or_none()


async def create_customer(db: AsyncSession, data: CustomerCreate):
    customer = Customer(full_name=data.full_name, email=data.email, phone=data.phone)
    db.add(customer)
    await db.commit()
    await db.refresh(customer)
    return customer


async def delete_customer(db: AsyncSession, customer: Customer):
    await db.delete(customer)
    await db.commit()
