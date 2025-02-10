from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from .routers import query, sources, storage

app = FastAPI(
    docs_url="/docs",
    title="Digital Brain API",
    description="API for uploading and querying pdf files",
    version="0.1.0",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/v1")
router.include_router(query.router)
router.include_router(sources.router)
router.include_router(storage.router)

app.include_router(router)