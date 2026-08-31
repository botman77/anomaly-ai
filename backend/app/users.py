

from fastapi import APIRouter, HTTPException

from .database import get_pool
from .schemas import UserCreate, UserLogin
from .security import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ============================================
# USER REGISTRATION
# ============================================

@router.post("/register")
async def register(user: UserCreate):

    pool = get_pool()

    async with pool.acquire() as conn:

        existing = await conn.fetchrow(
            """
            SELECT id
            FROM users
            WHERE email=$1
            """,
            user.email,
        )

        if existing:

            raise HTTPException(
                status_code=400,
                detail="Email already exists",
            )

        password_hash = hash_password(user.password)

        await conn.execute(
            """
            INSERT INTO users
            (
                full_name,
                institution,
                email,
                password_hash
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4
            )
            """,
            user.full_name,
            user.institution,
            user.email,
            password_hash,
        )

        return {
            "message": "Account created successfully"
        }


# ============================================
# USER LOGIN
# ============================================

@router.post("/login")
async def login(user: UserLogin):

    pool = get_pool()

    async with pool.acquire() as conn:

        db_user = await conn.fetchrow(
            """
            SELECT *
            FROM users
            WHERE email=$1
            """,
            user.email,
        )

        if db_user is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )

        if not verify_password(
            user.password,
            db_user["password_hash"],
        ):

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )

        access_token = create_access_token(
            {
                "sub": db_user["email"],
                "user_id": db_user["id"],
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user["id"],
                "full_name": db_user["full_name"],
                "institution": db_user["institution"],
                "email": db_user["email"],
            },
        }