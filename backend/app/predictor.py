
import os
import joblib
import numpy as np
import pandas as pd

from .cleaner import DataCleaner   # Import your DataCleaner class
from .progress import update_progress




class VaccinationFeatureEngineer:

    def transform(self, df):

        print("\nCreating vaccination features...")

        df = df.copy()

        # =====================================================
        # NUMERIC CONVERSION
        # =====================================================

        df["TIME_PERIOD"] = pd.to_numeric(
            df["TIME_PERIOD"],
            errors="coerce"
        )

        df["OBS_VALUE"] = pd.to_numeric(
            df["OBS_VALUE"],
            errors="coerce"
        )

        # =====================================================
        # GROUPING VARIABLES
        # =====================================================

        group_cols = [
            "REF_AREA",
            "INDICATOR",
            "SEX",
            "AGE"
        ]

        # =====================================================
        # SORT CHRONOLOGICALLY
        # =====================================================

        df = df.sort_values(
            group_cols + ["TIME_PERIOD"]
        ).reset_index(drop=True)

        # =====================================================
        # GROUP OBSERVATIONS
        # =====================================================

        grouped = df.groupby(
            group_cols,
            sort=False
        )["OBS_VALUE"]

        # =====================================================
        # PREVIOUS AVAILABLE OBSERVATION
        # =====================================================

        df["PREVIOUS_OBS_VALUE"] = grouped.shift(1)

        # =====================================================
        # PREVIOUS AVAILABLE YEAR
        # =====================================================

        df["PREVIOUS_YEAR"] = (
            df.groupby(
                group_cols,
                sort=False
            )["TIME_PERIOD"]
            .shift(1)
        )

        # =====================================================
        # CONSECUTIVE YEAR CHECK
        # =====================================================

        df["IS_CONSECUTIVE_YEAR"] = (
            df["TIME_PERIOD"] -
            df["PREVIOUS_YEAR"]
            == 1
        )

        # =====================================================
        # CHANGE FROM PREVIOUS AVAILABLE OBSERVATION
        # =====================================================

        df["CHANGE_FROM_PREVIOUS"] = (
            df["OBS_VALUE"] -
            df["PREVIOUS_OBS_VALUE"]
        )

        # =====================================================
        # PERCENT CHANGE FROM PREVIOUS OBSERVATION
        # =====================================================

        df["PERCENT_CHANGE_FROM_PREVIOUS"] = (
            df["CHANGE_FROM_PREVIOUS"] /
            df["PREVIOUS_OBS_VALUE"].replace(
                0,
                np.nan
            )
        ) * 100

        # =====================================================
        # TRUE YEARLY CHANGE
        # =====================================================

        df["YEARLY_CHANGE"] = np.where(
            df["IS_CONSECUTIVE_YEAR"],
            df["CHANGE_FROM_PREVIOUS"],
            np.nan
        )

        # =====================================================
        # TRUE YEARLY PERCENT CHANGE
        # =====================================================

        df["PERCENT_CHANGE"] = np.where(
            df["IS_CONSECUTIVE_YEAR"],
            df["PERCENT_CHANGE_FROM_PREVIOUS"],
            np.nan
        )

        # =====================================================
        # HISTORICAL MEAN
        # ONLY PREVIOUS OBSERVATIONS
        # =====================================================

        df["HISTORICAL_MEAN"] = (
            grouped
            .transform(
                lambda x:
                x.shift(1)
                .expanding(
                    min_periods=2
                )
                .mean()
            )
        )

        # =====================================================
        # HISTORICAL STANDARD DEVIATION
        # =====================================================

        df["HISTORICAL_STD"] = (
            grouped
            .transform(
                lambda x:
                x.shift(1)
                .expanding(
                    min_periods=2
                )
                .std()
            )
        )

        # =====================================================
        # DEVIATION FROM HISTORICAL MEAN
        # =====================================================

        df["DEVIATION_FROM_HISTORICAL_MEAN"] = (
            df["OBS_VALUE"] -
            df["HISTORICAL_MEAN"]
        )

        # =====================================================
        # ROLLING MEAN - PREVIOUS 3 OBSERVATIONS
        # =====================================================

        df["ROLLING_MEAN_3"] = (
            grouped
            .transform(
                lambda x:
                x.shift(1)
                .rolling(
                    window=3,
                    min_periods=2
                )
                .mean()
            )
        )

        # =====================================================
        # ROLLING STANDARD DEVIATION
        # =====================================================

        df["ROLLING_STD_3"] = (
            grouped
            .transform(
                lambda x:
                x.shift(1)
                .rolling(
                    window=3,
                    min_periods=2
                )
                .std()
            )
        )

        # =====================================================
        # DEVIATION FROM ROLLING MEAN
        # =====================================================

        df["DEVIATION_FROM_ROLLING_MEAN"] = (
            df["OBS_VALUE"] -
            df["ROLLING_MEAN_3"]
        )

        print("\nFeature engineering completed.")

        return df




import os
import joblib
import numpy as np
import pandas as pd

from .cleaner import DataCleaner
from .progress import update_progress



class VaccinationPredictor:

    def __init__(self):

        # ==========================================================
        # LOAD PREPROCESSING PIPELINE
        # ==========================================================

        self.pipeline = joblib.load(
            "models/pipeline.joblib"
        )

        # ==========================================================
        # LOAD TRAINED MODELS
        # ==========================================================

        self.iforest = joblib.load(
            "models/isolation_forest.joblib"
        )

        self.lof = joblib.load(
            "models/lof.joblib"
        )

        self.ocsvm = joblib.load(
            "models/oneclass_svm.joblib"
        )


        self.kmeans = joblib.load(
            "models/kmeans.joblib"
        )

        self.kmeans_threshold = joblib.load(
            "models/kmeans_threshold.joblib"
        )

        # ==========================================================
        # FEATURE ENGINEER
        # ==========================================================

        self.feature_engineer = VaccinationFeatureEngineer()

    def predict(self, df: pd.DataFrame):

        print("=" * 70)
        print("STARTING PREDICTION")
        print("=" * 70)

        # ==========================================================
        # STEP 1 - CLEAN DATA
        # ==========================================================

        update_progress(
            20,
            "Cleaning vaccination dataset..."
        )

        cleaner = DataCleaner()

        df = cleaner.fit_transform(df)

        print("Dataset cleaned successfully.")
        print(f"Cleaned Shape: {df.shape}")

        # ==========================================================
        # STEP 2 - FEATURE ENGINEERING
        # ==========================================================

        update_progress(
            30,
            "Creating vaccination features..."
        )

        df = self.feature_engineer.transform(df)

        print("Feature engineering completed.")
        print(f"Feature Engineered Shape: {df.shape}")

        # ==========================================================
        # STEP 3 - PREPROCESSING
        # ==========================================================

        update_progress(
            40,
            "Preprocessing dataset..."
        )

        X = self.pipeline.transform(df)

        if hasattr(X, "toarray"):
            X = X.toarray()

        print("Preprocessing completed.")
        print(f"Processed Shape: {X.shape}")

        # ==========================================================
        # STEP 4 - ISOLATION FOREST
        # ==========================================================

        update_progress(
            50,
            "Running Isolation Forest..."
        )

        df["IF_Prediction"] = (
            self.iforest.predict(X)
        )

        # ==========================================================
        # STEP 5 - LOCAL OUTLIER FACTOR
        # ==========================================================

        update_progress(
            60,
            "Running Local Outlier Factor..."
        )


        df["LOF_Prediction"] = (
                self.lof.predict(X)
            )

        # ==========================================================
        # STEP 6 - ONE-CLASS SVM
        # ==========================================================

        update_progress(
            70,
            "Running One-Class SVM..."
        )

        df["OCSVM_Prediction"] = (
            self.ocsvm.predict(X)
        )

            
        # ==========================================================
        # STEP 8 - K-MEANS
        # ==========================================================

        update_progress(
            86,
            "Running K-Means..."
        )

        distances = np.min(
            self.kmeans.transform(X),
            axis=1
        )

        # Use the EXACT threshold learned during training
        df["KMeans_Prediction"] = np.where(
            distances >= self.kmeans_threshold,
            -1,
            1
        )
        
        # ==========================================================
        # STEP 9 - COMBINED VOTING
        # ==========================================================

        update_progress(
            93,
            "Combining predictions..."
        )

        votes = (
            (df["IF_Prediction"] == -1).astype(int)
            + (df["LOF_Prediction"] == -1).astype(int)
            + (df["OCSVM_Prediction"] == -1).astype(int)
            + (df["KMeans_Prediction"] == -1).astype(int)
        )

        df["Anomaly_Votes"] = votes

        df["Combined_Prediction"] = np.where(
            votes >= 3,
            -1,
            1
        )

        # ==========================================================
        # STEP 10 - SAVE RESULTS
        # ==========================================================

        update_progress(
            97,
            "Saving prediction results..."
        )

        os.makedirs(
            "results",
            exist_ok=True
        )

        output_file = (
            "results/predictions.csv"
        )

        df.to_csv(
            output_file,
            index=False
        )

        # ==========================================================
        # STEP 11 - SUMMARY
        # ==========================================================

        summary = {

            "Total Records":
                len(df),

            "Isolation Forest":
                int(
                    (df["IF_Prediction"] == -1)
                    .sum()
                ),

            "LOF":
                int(
                    (df["LOF_Prediction"] == -1)
                    .sum()
                ),

            "One-Class SVM":
                int(
                    (df["OCSVM_Prediction"] == -1)
                    .sum()
                ),



            "KMeans":
                int(
                    (df["KMeans_Prediction"] == -1)
                    .sum()
                ),

            "Combined":
                int(
                    (df["Combined_Prediction"] == -1)
                    .sum()
                )
        }

        update_progress(
            100,
            "Analysis completed successfully."
        )

        print("\nPrediction Completed Successfully")
        print(summary)

        return {

            "predictions": df,

            "summary": summary,

            "output_file": output_file
        }


# ==============================================================
# CREATE PREDICTOR
# ==============================================================

predictor = VaccinationPredictor()