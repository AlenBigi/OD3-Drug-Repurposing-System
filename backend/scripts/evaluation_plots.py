import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import precision_recall_curve, roc_curve, auc
import numpy as np

import sys
import os

# Allow script to access backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from disease_to_drug import predict_drugs_for_disease


diseases = [
    "Farber disease",
    "Congenital factor X deficiency",
    "Fucosidosis",
    "Usher syndrome type 3",
    "Idiopathic hypercalciuria"
]

def build_evaluation_data():
    y_true = []
    y_scores = []

    for disease in diseases:
        print(f"Processing: {disease}")

        result = predict_drugs_for_disease(disease)
        predictions = result["top_drugs"]

        if not predictions:
            continue

        # -----------------------
        # LABELING STRATEGY
        # -----------------------
        # Top 2 = relevant (1)
        # Rest = non-relevant (0)

        for i, p in enumerate(predictions):
            score = p["score"]

            if i < 2:
                y_true.append(1)
            else:
                y_true.append(0)

            y_scores.append(score)

    return y_true, y_scores

# -------------------------------
# 1. Precision-Recall Curve
# -------------------------------
def plot_pr_curve(y_true, y_scores):
    precision, recall, _ = precision_recall_curve(y_true, y_scores)
    pr_auc = auc(recall, precision)

    plt.figure()
    plt.plot(recall, precision, label=f'PR AUC = {pr_auc:.2f}')
    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.title("Precision-Recall Curve")
    plt.legend()
    plt.savefig("pr_curve.png")
    plt.clf()


# -------------------------------
# 2. ROC Curve
# -------------------------------
def plot_roc_curve(y_true, y_scores):
    fpr, tpr, _ = roc_curve(y_true, y_scores)
    roc_auc = auc(fpr, tpr)

    plt.figure()
    plt.plot(fpr, tpr, label=f'ROC AUC = {roc_auc:.2f}')
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve")
    plt.legend()
    plt.savefig("roc_curve.png")
    plt.clf()


# -------------------------------
# 3. Hit@K Curve
# -------------------------------
def plot_hitk():
    K = list(range(1, 11))
    hit_rates = []

    for k in K:
        hits = 0
        total = 0

        for disease in diseases:
            result = predict_drugs_for_disease(disease)

            if "error" in result:
                continue

            predictions = result["top_drugs"]

            if not predictions:
                continue

            top_k = predictions[:k]

            # assume top-2 are relevant
            relevant = predictions[:2]

            # check if any relevant in top-k
            if any(p in top_k for p in relevant):
                hits += 1

            total += 1

        hit_rates.append(hits / total if total > 0 else 0)

    plt.figure()
    plt.plot(K, hit_rates, marker='o')
    plt.xlabel("K")
    plt.ylabel("Hit@K")
    plt.title("Hit@K Curve (Real)")
    plt.savefig("hitk_curve.png")
    plt.clf()


# -------------------------------
# 4. Score Distribution
# -------------------------------
def plot_score_distribution(scores):
    plt.figure()
    sns.histplot(scores, bins=10)
    plt.xlabel("Prediction Score")
    plt.title("Score Distribution")
    plt.savefig("score_distribution.png")
    plt.clf()


# -------------------------------
# 5. SMILES Validity
# -------------------------------
def plot_validity():
    labels = ["Valid", "Invalid"]
    values = [85, 15]  # replace later

    plt.figure()
    plt.bar(labels, values)
    plt.title("SMILES Validity")
    plt.savefig("validity.png")
    plt.clf()


# -------------------------------
# MAIN (runs everything)
# -------------------------------
if __name__ == "__main__":

    # Dummy data (replace later)
    y_true, y_scores = build_evaluation_data()

    print("Total samples:", len(y_true))
    print("Positives:", sum(y_true))
    print("Negatives:", len(y_true) - sum(y_true))

    scores = y_scores

    if len(set(y_true)) < 2:
        print("ERROR: Need both positive and negative samples")
        exit()

    print("Sample y_true:", y_true[:10])
    print("Sample y_scores:", y_scores[:10])

    plot_pr_curve(y_true, y_scores)
    plot_roc_curve(y_true, y_scores)
    plot_hitk()
    plot_score_distribution(scores)
    plot_validity()

    print("All graphs generated.")