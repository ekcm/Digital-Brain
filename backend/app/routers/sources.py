from fastapi import APIRouter

router = APIRouter()

@router.get("/sources", tags=["sources"])
async def sources():
    return {"message": "Hello from sources"}