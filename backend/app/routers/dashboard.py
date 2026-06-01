from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.crud.order import get_dashboard_stats

router = APIRouter()


@router.get("")
async def dashboard(db: AsyncSession = Depends(get_db)):
    try:
        stats = await get_dashboard_stats(db)
        return stats
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
