import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import precision_recall_curve, roc_curve, auc
import numpy as np

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


# -------------------------------
# 3. Hit@K Curve
# -------------------------------
def plot_hitk():
    K = list(range(1, 11))
    hit_rates = [0.2, 0.35, 0.5, 0.6, 0.7, 0.75, 0.8, 0.82, 0.85, 0.9]  # replace later

    plt.figure()
    plt.plot(K, hit_rates, marker='o')
    plt.xlabel("K")
    plt.ylabel("Hit@K")
    plt.title("Hit@K Curve")
    plt.savefig("hitk_curve.png")


# -------------------------------
# 4. Score Distribution
# -------------------------------
def plot_score_distribution(scores):
    plt.figure()
    sns.histplot(scores, bins=10)
    plt.xlabel("Prediction Score")
    plt.title("Score Distribution")
    plt.savefig("score_distribution.png")


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


# -------------------------------
# MAIN (runs everything)
# -------------------------------
if __name__ == "__main__":

    # Dummy data (replace later)
    y_true = [1, 0, 1, 0, 1]
    y_scores = [0.9, 0.2, 0.8, 0.3, 0.7]
    scores = [1.2, 1.5, 1.8, 2.0, 2.3, 3.0, 3.5]

    plot_pr_curve(y_true, y_scores)
    plot_roc_curve(y_true, y_scores)
    plot_hitk()
    plot_score_distribution(scores)
    plot_validity()

    print("All graphs generated.")