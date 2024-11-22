from fastapi import APIRouter 
listing_router = APIRouter(prefix="listing", tags=["listings"])

#@listing_router.post("create_new_listing", )