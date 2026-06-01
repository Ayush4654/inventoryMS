from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


async def get_products(db: AsyncSession):
    result = await db.execute(select(Product).order_by(Product.id))
    return result.scalars().all()


async def get_product(db: AsyncSession, product_id: int):
    result = await db.execute(select(Product).where(Product.id == product_id))
    return result.scalar_one_or_none()


async def get_product_by_sku(db: AsyncSession, sku: str):
    result = await db.execute(select(Product).where(Product.sku == sku))
    return result.scalar_one_or_none()


async def create_product(db: AsyncSession, data: ProductCreate):
    product = Product(name=data.name, sku=data.sku, price=data.price, quantity=data.quantity)
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


async def update_product(db: AsyncSession, product: Product, data: ProductUpdate):
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    await db.commit()
    await db.refresh(product)
    return product


async def delete_product(db: AsyncSession, product: Product):
    await db.delete(product)
    await db.commit()
