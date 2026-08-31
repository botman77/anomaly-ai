from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter(
    prefix="/results",
    tags=["Results"]
)

RESULT_FILE = "results/predictions.csv"


@router.get("/summary")
def summary():

    if not os.path.exists(RESULT_FILE):
        return {"error": "No analysis found"}

    df = pd.read_csv(RESULT_FILE)

    total = len(df)

    anomalies = int(
        (df["Combined_Prediction"] == -1).sum()
    )

    normal = total - anomalies

    return {

        "total_records": total,

        "normal_records": normal,

        "anomalies": anomalies,

        "detection_rate":
        round(anomalies / total * 100, 2)

    }





@router.get("/country")
def country_chart():

    df = pd.read_csv(RESULT_FILE)

    data = (

        df[df["Combined_Prediction"] == -1]

        .groupby("REF_AREA")

        .size()

        .reset_index(name="count")

        .sort_values(
            "count",
            ascending=False
        )

    )

    return data.to_dict(
        orient="records"
    )


@router.get("/year")
def year_chart():

    df = pd.read_csv(RESULT_FILE)

    data = (

        df[df["Combined_Prediction"] == -1]

        .groupby("TIME_PERIOD")

        .size()

        .reset_index(name="count")

        .sort_values("TIME_PERIOD")

    )

    return data.to_dict(
        orient="records"
    )



@router.get("/indicator")
def indicator_chart():

    df = pd.read_csv(RESULT_FILE)

    data = (

        df[df["Combined_Prediction"] == -1]

        .groupby("INDICATOR")

        .size()

        .reset_index(name="count")

        .sort_values(
            "count",
            ascending=False
        )

        .head(10)

    )

    return data.to_dict(
        orient="records"
    )



@router.get("/sex")
def sex_chart():

    df = pd.read_csv(RESULT_FILE)

    data = (

        df[df["Combined_Prediction"] == -1]

        .groupby("SEX")

        .size()

        .reset_index(name="count")

    )

    return data.to_dict(
        orient="records"
    )



@router.get("/age")
def age_chart():

    df = pd.read_csv(RESULT_FILE)

    data = (

        df[df["Combined_Prediction"] == -1]

        .groupby("AGE")

        .size()

        .reset_index(name="count")

    )

    return data.to_dict(
        orient="records"
    )


@router.get("/models")
def model_chart():

    df = pd.read_csv(RESULT_FILE)

    return [

        {

            "model":"Isolation Forest",

            "count":
            int((df["IF_Prediction"]==-1).sum())

        },

        {

            "model":"LOF",

            "count":
            int((df["LOF_Prediction"]==-1).sum())

        },

        {

            "model":"One-Class SVM",

            "count":
            int((df["OCSVM_Prediction"]==-1).sum())

        },



        {

            "model":"KMeans",

            "count":
            int((df["KMeans_Prediction"]==-1).sum())

        },

        {

            "model":"Combined",

            "count":
            int((df["Combined_Prediction"]==-1).sum())

        }

    ]






# from fastapi.encoders import jsonable_encoder
# import numpy as np
# import pandas as pd


# @router.get("/table")
# def table(page: int = 1, size: int = 30):

#     df = pd.read_csv(RESULT_FILE)

#     # Replace infinities with NaN
#     df.replace([np.inf, -np.inf], np.nan, inplace=True)

#     # Convert dataframe to object type
#     df = df.astype(object)

#     # Replace NaN with None
#     df = df.where(pd.notnull(df), None)

#     start = (page - 1) * size
#     end = start + size

#     records = df.iloc[start:end].to_dict(orient="records")

#     # Add row numbers
#     for i, row in enumerate(records, start=start + 1):
#         row["Row"] = i

#     return jsonable_encoder({
#         "total": len(df),
#         "page": page,
#         "size": size,
#         "rows": records
#     })

from fastapi.encoders import jsonable_encoder
import numpy as np
import pandas as pd


@router.get("/table")
def table(
    page: int = 1,
    size: int = 30,
    country: str = "",
    status: str = ""
):

    df = pd.read_csv(RESULT_FILE)

    # --------------------------------------------------
    # Replace infinities with NaN
    # --------------------------------------------------

    df.replace(
        [np.inf, -np.inf],
        np.nan,
        inplace=True
    )

    # --------------------------------------------------
    # COUNTRY FILTER
    # --------------------------------------------------

    if country and country != "All":

        df = df[
            df["REF_AREA"].astype(str).str.strip()
            == country.strip()
        ]

    # --------------------------------------------------
    # STATUS FILTER
    # --------------------------------------------------

    if status and status != "All":

        if status == "Anomaly":

            df = df[
                df["Combined_Prediction"] == -1
            ]

        elif status == "Normal":

            df = df[
                df["Combined_Prediction"] == 1
            ]

    # --------------------------------------------------
    # TOTAL AFTER FILTERING
    # --------------------------------------------------

    total = len(df)

    # --------------------------------------------------
    # PAGINATION
    # --------------------------------------------------

    start = (page - 1) * size
    end = start + size

    records = df.iloc[start:end].copy()

    # --------------------------------------------------
    # Add row numbers
    # --------------------------------------------------

    records["Row"] = range(
        start + 1,
        start + 1 + len(records)
    )

    # --------------------------------------------------
    # Convert NaN → None
    # --------------------------------------------------

    records = records.astype(object)

    records = records.where(
        pd.notnull(records),
        None
    )

    return jsonable_encoder({

        "total": total,

        "page": page,

        "size": size,

        "country": country,

        "status": status,

        "rows": records.to_dict(
            orient="records"
        )

    })





from fastapi.responses import FileResponse
import pandas as pd
import numpy as np
import tempfile

@router.get("/download")
def download_report():

    df = pd.read_csv(RESULT_FILE)

    # Replace infinities
    df.replace([np.inf, -np.inf], np.nan, inplace=True)

    # Add original row number
    df.insert(0, "Row", range(1, len(df) + 1))

    # Convert prediction to readable status
    df["Status"] = df["Combined_Prediction"].map({
        -1: "Anomaly",
         1: "Normal"
    })

    # Optional: remove model prediction columns
    columns_to_remove = [
        "IF_Prediction",
        "LOF_Prediction",
        "OCSVM_Prediction",

        "KMeans_Prediction",
        "Combined_Prediction"
    ]

    df.drop(
        columns=[c for c in columns_to_remove if c in df.columns],
        inplace=True
    )

    # Create temporary Excel file
    temp = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".xlsx"
    )

    df.to_excel(
        temp.name,
        index=False
    )

    return FileResponse(
        path=temp.name,
        filename="Vaccination_Anomaly_Report.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )







