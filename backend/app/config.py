import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = os.getenv(
        "APP_NAME",
        "My Project",
    )

    ENVIRONMENT: str = os.getenv(
        "ENVIRONMENT",
        "development",
    )

    BACKEND_HOST: str = os.getenv(
        "BACKEND_HOST",
        "127.0.0.1",
    )

    BACKEND_PORT: int = int(
        os.getenv(
            "BACKEND_PORT",
            "8000",
        )
    )


settings = Settings()