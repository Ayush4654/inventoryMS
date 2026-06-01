from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.crud.product import get_products, get_product, get_product_by_sku, create_product, update_product, delete_product

router = APIRouter()


@router.post("", response_model=ProductResponse, status_code=201)
async def create(data: ProductCreate, db: AsyncSession = Depends(get_db)):
    try:
        existing = await get_product_by_sku(db, data.sku)
        if existing:
            raise HTTPException(status_code=400, detail=f"Product with SKU '{data.sku}' already exists")
        product = await create_product(db, data)
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=list[ProductResponse])
async def list_all(db: AsyncSession = Depends(get_db)):
    try:
        return await get_products(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{product_id}", response_model=ProductResponse)
async def get_one(product_id: int, db: AsyncSession = Depends(get_db)):
    try:
        product = await get_product(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{product_id}", response_model=ProductResponse)
async def update(product_id: int, data: ProductUpdate, db: AsyncSession = Depends(get_db)):
    try:
        product = await get_product(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if data.sku is not None and data.sku != product.sku:
            existing = await get_product_by_sku(db, data.sku)
            if existing:
                raise HTTPException(status_code=400, detail=f"Product with SKU '{data.sku}' already exists")
        updated = await update_product(db, product, data)
        return updated
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{product_id}", status_code=200)
async def delete(product_id: int, db: AsyncSession = Depends(get_db)):
    try:
        product = await get_product(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        await delete_product(db, product)
        return {"detail": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
