from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import os
from .predictor import VaccinationPredictor
from .progress import update_progress

router = APIRouter(
    prefix="/dataset",
    tags=["Dataset"]
)


UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "results"


os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

os.makedirs(
    RESULT_FOLDER,
    exist_ok=True
)

predictor = VaccinationPredictor()





from .predictor import predictor
from .progress import update_progress

router = APIRouter(
    prefix="/dataset",
    tags=["Dataset"]
)

UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "results"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...)
):

    # -----------------------------
    # Upload Started
    # -----------------------------
    update_progress(
        5,
        "Uploading dataset..."
    )

    if not file.filename.endswith(".csv"):

        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed"
        )

    filepath = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    contents = await file.read()

    with open(filepath, "wb") as f:
        f.write(contents)

    # -----------------------------
    # Dataset Loaded
    # -----------------------------
    update_progress(
        15,
        "Reading uploaded dataset..."
    )

    df = pd.read_csv(filepath)

    # -----------------------------
    # Start Prediction
    # -----------------------------
    update_progress(
        20,
        "Starting anomaly detection..."
    )

    output = predictor.predict(df)

    

    # -----------------------------
    # Save Predictions
    # -----------------------------
    update_progress(
        98,
        "Saving prediction results..."
    )

    prediction_file = os.path.join(
        RESULT_FOLDER,
        "predictions.csv"
    )

    output["predictions"].to_csv(
        prediction_file,
        index=False
    )

    # -----------------------------
    # Completed
    # -----------------------------
    update_progress(
        100,
        "Analysis completed successfully."
    )

    return {

        "message":
        "Analysis completed successfully",

        "summary":
        output["summary"],

        "download_file":
        prediction_file

    }