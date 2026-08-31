import json
import os

PROGRESS_FILE = "results/progress.json"

os.makedirs("results", exist_ok=True)


def update_progress(percent: int, step: str):

    with open(PROGRESS_FILE, "w") as f:

        json.dump(
            {
                "progress": percent,
                "step": step
            },
            f
        )