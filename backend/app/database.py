
# import asyncpg
# import os

# from dotenv import load_dotenv

# load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL")

# pool = None


# async def connect_db():

#     global pool

#     pool = await asyncpg.create_pool(
#         DATABASE_URL,
#         min_size=1,
#         max_size=10
#     )


# async def close_db():

#     global pool

#     if pool:
#         await pool.close()


# def get_pool():

#     return pool







# import asyncpg
# import os

# from dotenv import load_dotenv

# load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL")

# pool = None


# async def connect_db():

#     global pool

#     pool = await asyncpg.create_pool(
#         DATABASE_URL,
#         min_size=1,
#         max_size=10
#     )

#     print("PostgreSQL connected successfully")


# async def close_db():

#     global pool

#     if pool:
#         await pool.close()
#         print("PostgreSQL connection closed")


# def get_pool():

#     return pool


# import asyncpg
# import os

# from dotenv import load_dotenv

# load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL")

# pool = None


# async def connect_db():

#     global pool

#     try:

#         pool = await asyncpg.create_pool(
#             DATABASE_URL,
#             min_size=1,
#             max_size=10
#         )

#         print("PostgreSQL connected successfully")

#     except Exception as e:

#         print(f"Database connection failed: {e}")

#         raise


# async def close_db():

#     global pool

#     if pool:

#         await pool.close()

#         print("PostgreSQL connection closed")


# def get_pool():

#     return pool








import asyncpg
import os

from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

pool = None


async def connect_db():

    global pool

    pool = await asyncpg.create_pool(
        DATABASE_URL,
        min_size=1,
        max_size=10
    )

    print("PostgreSQL connected successfully")


async def close_db():

    global pool

    if pool:
        await pool.close()
        print("PostgreSQL connection closed")


def get_pool():

    return pool