from decimal import Decimal
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.customer import Customer
from app.schemas.order import OrderCreate


async def get_orders(db: AsyncSession):
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items), selectinload(Order.customer))
        .order_by(Order.id.desc())
    )
    return result.scalars().all()


async def get_order(db: AsyncSession, order_id: int):
    result = await db.execute(
        select(Order)
        .options(selectinload(Order.items), selectinload(Order.customer))
        .where(Order.id == order_id)
    )
    return result.scalar_one_or_none()


async def create_order(db: AsyncSession, data: OrderCreate):
    items_data = []
    total = Decimal("0.00")

    for item in data.items:
        product_result = await db.execute(select(Product).where(Product.id == item.product_id))
        product = product_result.scalar_one_or_none()
        if not product:
            raise ValueError(f"Product with id {item.product_id} not found")
        if product.quantity < item.quantity:
            raise ValueError(f"Insufficient stock for product '{product.name}'. Available: {product.quantity}, requested: {item.quantity}")

        unit_price = product.price
        subtotal = Decimal(str(item.quantity)) * unit_price
        total += subtotal

        product.quantity -= item.quantity
        items_data.append({
            "product_id": product.id,
            "quantity": item.quantity,
            "unit_price": unit_price,
        })

    order = Order(customer_id=data.customer_id, total_amount=total, status=OrderStatus.pending)
    db.add(order)
    await db.flush()

    for item_dict in items_data:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_dict["product_id"],
            quantity=item_dict["quantity"],
            unit_price=item_dict["unit_price"],
        )
        db.add(order_item)

    await db.commit()
    await db.refresh(order)
    return order


async def delete_order(db: AsyncSession, order: Order):
    for item in order.items:
        product_result = await db.execute(select(Product).where(Product.id == item.product_id))
        product = product_result.scalar_one_or_none()
        if product:
            product.quantity += item.quantity

    await db.delete(order)
    await db.commit()


async def get_dashboard_stats(db: AsyncSession):
    products_count_result = await db.execute(select(func.count(Product.id)))
    total_products = products_count_result.scalar()

    customers_count_result = await db.execute(select(func.count(Customer.id)))
    total_customers = customers_count_result.scalar()

    orders_count_result = await db.execute(select(func.count(Order.id)))
    total_orders = orders_count_result.scalar()

    low_stock_result = await db.execute(
        select(Product).where(Product.quantity < 10).order_by(Product.quantity)
    )
    low_stock = low_stock_result.scalars().all()

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "low_stock_products": [
            {"id": p.id, "name": p.name, "sku": p.sku, "quantity": p.quantity}
            for p in low_stock
        ],
    }
