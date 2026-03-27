import xml.etree.ElementTree as ET
import json

# ---------- HELPER ----------
def normalize_id(orpha_id):
    if not orpha_id:
        return None
    return orpha_id.replace("ORPHA:", "").strip()


# ---------- INIT ----------
disease_data = {}

# ---------- STEP 1: PRODUCT1 (BASE) ----------
print("Loading product1 (disease names)...")

tree = ET.parse("data/raw/orphanet/en_product1.xml")
root = tree.getroot()

for disorder in root.findall(".//Disorder"):
    orpha_id = normalize_id(disorder.findtext("OrphaCode"))
    name = disorder.findtext("Name")

    if orpha_id:
        disease_data[orpha_id] = {
            "name": name,
            "prevalence": None,
            "genes": [],
            "symptoms": []
        }

print(f"Loaded {len(disease_data)} diseases")


# ---------- STEP 2: PRODUCT9 (PREVALENCE) ----------
print("Adding prevalence...")

tree = ET.parse("data/raw/orphanet/en_product9_prev.xml")
root = tree.getroot()

for disorder in root.findall(".//Disorder"):
    orpha_id = normalize_id(disorder.findtext("OrphaCode"))

    if not orpha_id:
        continue

    prev_elem = disorder.find(".//PrevalenceType/Name")
    prevalence = prev_elem.text if prev_elem is not None else None

    if orpha_id in disease_data:
        disease_data[orpha_id]["prevalence"] = prevalence


# ---------- STEP 3: PRODUCT6 (GENES) ----------
print("Adding genes...")

tree = ET.parse("data/raw/orphanet/en_product6.xml")
root = tree.getroot()

count = 0

for disorder in root.findall(".//Disorder"):
    orpha_id = normalize_id(disorder.findtext("OrphaCode"))

    if not orpha_id:
        continue

    for assoc in disorder.findall(".//DisorderGeneAssociation"):
        gene_elem = assoc.find(".//Gene/Symbol")
        gene = gene_elem.text if gene_elem is not None else None

        if gene and orpha_id in disease_data:
            disease_data[orpha_id]["genes"].append(gene)
            count += 1

print(f"Mapped {count} gene associations")


# ---------- STEP 4: PRODUCT4 (SYMPTOMS) ----------
print("Adding symptoms...")

tree = ET.parse("data/raw/orphanet/en_product4.xml")
root = tree.getroot()

count = 0

for disorder in root.findall(".//Disorder"):
    orpha_id = normalize_id(disorder.findtext("OrphaCode"))

    if not orpha_id:
        continue

    for assoc in disorder.findall(".//HPODisorderAssociation"):
        
        # Try BOTH possible tags (robust parsing)
        term_elem = assoc.find(".//HPO/HPOTerm")
        
        if term_elem is None:
            term_elem = assoc.find(".//HPO/Term")

        term = term_elem.text if term_elem is not None else None

        if term and orpha_id in disease_data:
            disease_data[orpha_id]["symptoms"].append(term)
            count += 1

print(f"Mapped {count} symptom entries")


# ---------- STEP 5: CLEAN ----------
print("Cleaning data...")

for d in disease_data.values():
    d["genes"] = list(set(d["genes"]))
    d["symptoms"] = list(set(d["symptoms"]))


# ---------- STEP 6: SAVE ----------
output_path = "data/processed/disease_dataset.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(disease_data, f, indent=2)

print(f"Dataset saved to {output_path}")