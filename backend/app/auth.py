

from fastapi import APIRouter, HTTPException

from .database import get_pool
from .schemas import RegisterRequest, LoginRequest
from .security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# REGISTER
# ==========================================

@router.post("/register")
async def register_user(user: RegisterRequest):

    pool = get_pool()

    if pool is None:
        raise HTTPException(
            status_code=500,
            detail="Database not connected."
        )

    async with pool.acquire() as conn:

        existing_user = await conn.fetchrow(
            """
            SELECT id
            FROM users
            WHERE email=$1
            """,
            user.email
        )

        if existing_user:

            raise HTTPException(
                status_code=400,
                detail="Email already exists."
            )

        password_hash = hash_password(
            user.password
        )

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
            password_hash
        )

    return {
        "message": "Account created successfully."
    }


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
async def login(user: LoginRequest):

    pool = get_pool()

    if pool is None:
        raise HTTPException(
            status_code=500,
            detail="Database not connected."
        )

    async with pool.acquire() as conn:

        db_user = await conn.fetchrow(
            """
            SELECT *
            FROM users
            WHERE email=$1
            """,
            user.email
        )

        if db_user is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        valid = verify_password(
            user.password,
            db_user["password_hash"]
        )

        if not valid:

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password."
            )

        token = create_access_token(
            {
                "sub": db_user["email"],
                "user_id": db_user["id"]
            }
        )

        return {

            "access_token": token,

            "token_type": "bearer",

            "user": {

                "id": db_user["id"],

                "full_name": db_user["full_name"],

                "institution": db_user["institution"],

                "email": db_user["email"]

            }

        }