from fastapi import APIRouter, HTTPException
from .database import get_pool
from .security import verify_password, create_access_token
from .schemas import LoginRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
async def login(user: LoginRequest):

    pool = get_pool()

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
                detail="Invalid email or password"
            )

        if not verify_password(
            user.password,
            db_user["password_hash"]
        ):

            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
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

                "email": db_user["email"],

                "institution": db_user["institution"]

            }

        }
