import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

VACCINATION_INDICATORS = [
    "IM_BCG",
    "IM_DTP1",
    "IM_DTP3",
    "IM_HEPB3",
    "IM_HEPBB",
    "IM_HIB3",
    "IM_HPV",
    "IM_IPV1",
    "IM_IPV2",
    "IM_MCV1",
    "IM_MCV2",
    "IM_MENGA",
    "IM_PAB",
    "IM_PCV3",
    "IM_POL3",
    "IM_RCV1",
    "IM_ROTAC",
    "IM_YFV"
]




ENGINEERED_NUMERIC_COLUMNS = [

    "PREVIOUS_OBS_VALUE",

    "YEARLY_CHANGE",

    "PERCENT_CHANGE",

    "HISTORICAL_MEAN",

    "HISTORICAL_STD",

    "DEVIATION_FROM_HISTORICAL_MEAN",

    "ROLLING_MEAN_3",

    "ROLLING_STD_3",

    "DEVIATION_FROM_ROLLING_MEAN"

]

RAW_NUMERIC_COLUMNS = [

    "TIME_PERIOD",
    "OBS_VALUE"

]

NUMERIC_COLUMNS = (

    RAW_NUMERIC_COLUMNS
    +
    ENGINEERED_NUMERIC_COLUMNS

)


CATEGORICAL_COLUMNS = [

    "REF_AREA",
    "INDICATOR",
    "SEX",
    "AGE"

]


ALL_COLUMNS = [

    "REF_AREA",
    "INDICATOR",
    "SEX",
    "AGE",
    "TIME_PERIOD",
    "OBS_VALUE",
    "LOWER_BOUND",
    "UPPER_BOUND",
    "WGTD_SAMPL_SIZE",
    "UNIT_MULTIPLIER",
    "UNIT_MEASURE",
    "OBS_STATUS",
    "OBS_CONF",
    "DATA_SOURCE",
    "TIME_PERIOD_METHOD",
    "REF_PERIOD"

]



# -------------------------------------------------------
# Data Cleaner
# -------------------------------------------------------


class DataCleaner(BaseEstimator, TransformerMixin):

    def clean_ref_area(self, value):
        value = str(value).strip()

        # Rule 1: Contains (SDGRC)
        if "(SDGRC)" in value:
            return value.split("(SDGRC)", 1)[1].strip()

        # Rule 2: Remove everything before the first colon
        if ":" in value:
            return value.split(":", 1)[1].strip()

        return value

    def __init__(self):

        self.original_rows = 0
        self.filtered_rows = 0
        self.final_rows = 0

    def fit(self, X, y=None):

        return self

    def transform(self, X):

        X = X.copy()

        print("=" * 70)
        print("STARTING DATA CLEANING")
        print("=" * 70)

        self.original_rows = len(X)

        # ---------------------------------------------------
        # Standardize Column Names
        # ---------------------------------------------------

        X.columns = [

            col.split(":")[0].strip()

            for col in X.columns

        ]
        print("\nFirst 30 indicator values:")
        print(X["INDICATOR"].dropna().unique()[:30])

        print("\nNumber of unique indicators:")
        print(X["INDICATOR"].nunique())

        print(f"Original Records : {self.original_rows:,}")

        # ---------------------------------------------------
        # Keep Vaccination Indicators Only
        # ---------------------------------------------------


        # ---------------------------------------------------
        # Standardize Indicator Values
        # ---------------------------------------------------

        X["INDICATOR"] = (
            X["INDICATOR"]
            .astype(str)
            .str.split(":")
            .str[0]
            .str.strip()
        )



        X = X[
            X["INDICATOR"].isin(
                VACCINATION_INDICATORS
            )
        ]

        self.filtered_rows = len(X)

        print(
            f"Vaccination Records : {self.filtered_rows:,}"
        )

        # ---------------------------------------------------
        # Clean REF_AREA Values
        # ---------------------------------------------------

        X["REF_AREA"] = (
            X["REF_AREA"]
            .astype(str)
            .apply(self.clean_ref_area)
        )


        # ---------------------------------------------------
        # Keep Required Columns
        # ---------------------------------------------------

        X = X[ALL_COLUMNS]

        # ---------------------------------------------------
        # Convert Numeric Columns
        # ---------------------------------------------------

        for column in RAW_NUMERIC_COLUMNS:

            X[column] = pd.to_numeric(

                X[column],
                errors="coerce"

            )

        # ---------------------------------------------------
        # Remove Duplicates
        # ---------------------------------------------------

        duplicates = X.duplicated().sum()

        if duplicates > 0:

            print(
                f"Duplicate Records Removed : {duplicates:,}"
            )

            X = X.drop_duplicates()

        # ---------------------------------------------------
        # Remove Missing Key Values
        # ---------------------------------------------------

        X = X.dropna(

            subset=[

                "REF_AREA",
                "INDICATOR",
                "TIME_PERIOD",
                "OBS_VALUE"

            ]

        )

        # ---------------------------------------------------
        # Remove Impossible Values
        # ---------------------------------------------------

        X = X[
            X["OBS_VALUE"] >= 0
        ]

        if "LOWER_BOUND" in X.columns:

            X = X[
                (
                    X["LOWER_BOUND"].isna()
                )
                |
                (
                    X["UPPER_BOUND"].isna()
                )
                |
                (
                    X["LOWER_BOUND"]
                    <=
                    X["UPPER_BOUND"]
                )
            ]

        self.final_rows = len(X)

        print(
            f"Final Records : {self.final_rows:,}"
        )

        print("=" * 70)
        print("DATA CLEANING COMPLETED")
        print("=" * 70)

        return X.reset_index(drop=True)
