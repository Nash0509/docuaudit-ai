from groq import Groq
from app.core.config import GROQ_API_KEY, LLM_MODEL, CHROMA_PATH, EMBEDDING_MODEL
from app.core.rulebook import RULES
from sentence_transformers import SentenceTransformer
import chromadb
import json

client = Groq(api_key=GROQ_API_KEY)
embedding_model = SentenceTransformer(EMBEDDING_MODEL)
chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)

def get_embedding(text: str) -> list:
    return embedding_model.encode(text).tolist()

def retrieve_for_rule(collection, rule: dict, top_k=3) -> str:
    query = rule["name"] + " " + rule["description"]
    embedding = get_embedding(query)
    results = collection.query(query_embeddings=[embedding], n_results=top_k)
    return "\n\n".join(results["documents"][0])

def check_rule(rule: dict, context: str) -> dict:
    prompt = f"""You are a contract compliance auditor.

Your job is to check whether a specific clause exists and is compliant in the contract excerpt below.

Rule to check: {rule["name"]}
Rule description: {rule["description"]}

Contract excerpt:
{context}

Respond ONLY with a valid JSON object in this exact format, nothing else:
{{
  "status": "PASS" or "FAIL" or "WARN",
  "finding": "One sentence explaining what you found or did not find.",
  "citation": "Exact short quote from the contract if found, or 'Not found' if missing."
}}"""

    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.choices[0].message.content.strip()

    try:
        clean = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
    except Exception:
        return {
            "status": "WARN",
            "finding": "Could not parse AI response.",
            "citation": "Not found"
        }

def calculate_risk_score(results: list) -> int:
    fail_count = sum(1 for r in results if r["status"] == "FAIL")
    warn_count = sum(1 for r in results if r["status"] == "WARN")
    total = len(results)
    score = int(((fail_count * 2 + warn_count) / (total * 2)) * 100)
    return min(score, 100)

def run_audit(doc_id: str) -> dict:
    collection_name = doc_id.replace(".pdf", "")

    try:
        collection = chroma_client.get_collection(name=collection_name)
    except Exception:
        return {"error": f"Document '{doc_id}' not found. Please upload it first."}

    audit_results = []

    for rule in RULES:
        context = retrieve_for_rule(collection, rule)
        result = check_rule(rule, context)
        audit_results.append({
            "rule_id": rule["id"],
            "rule_name": rule["name"],
            "status": result.get("status", "WARN"),
            "finding": result.get("finding", ""),
            "citation": result.get("citation", "Not found")
        })

    risk_score = calculate_risk_score(audit_results)
    pass_count = sum(1 for r in audit_results if r["status"] == "PASS")
    fail_count = sum(1 for r in audit_results if r["status"] == "FAIL")
    warn_count = sum(1 for r in audit_results if r["status"] == "WARN")

    return {
        "document": doc_id,
        "risk_score": risk_score,
        "summary": {
            "total_rules": len(RULES),
            "passed": pass_count,
            "failed": fail_count,
            "warnings": warn_count
        },
        "results": audit_results
    }