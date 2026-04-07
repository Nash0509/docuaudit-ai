from app.services.llm_service import llm_service
from app.services.retrieval_service import retrieval_service
from app.core.rulebook import RULES
from app.core.logger import logger
import json


class AuditService:


    def check_rule(self, document_id: str, rule: dict, settings=None):
        try:
            logger.info(f"Checking rule {rule['name']} for {document_id}")

            top_k = settings.context_chunks if settings else 5
            context = "\n\n".join(
                retrieval_service.retrieve(
                    document_id,
                    rule["name"] + " " + rule["description"],
                    top_k=top_k
                )
            )

            strictness = settings.strictness if settings else "STANDARD"
            depth = settings.analysis_depth if settings else "Balanced"
            
            strictness_prompt = {
                "RELAXED": "Give the benefit of the doubt. Do not flag trivial issues.",
                "STANDARD": "Perform a standard, balanced compliance check.",
                "STRICT": "Be aggressive. Flag even minor deviations from standard compliance as failures."
            }.get(strictness, "Perform a standard, balanced compliance check.")
            
            depth_prompt = {
                "Concise": "Output a very brief, 1-sentence finding.",
                "Balanced": "Output a balanced 2-3 sentence finding.",
                "Detailed": "Output a comprehensive paragraph explaining the finding deeply."
            }.get(depth, "Output a balanced 2-3 sentence finding.")

            prompt = f"""
You are a senior contract compliance auditor.

Analyze whether contract satisfies rule.
Strictness directive: {strictness_prompt}
Analysis depth directive: {depth_prompt}

RULE:
{rule["name"]}

DESCRIPTION:
{rule["description"]}

CONTRACT:
{context}

Return ONLY valid JSON:

{{
"status":"PASS or FAIL or WARN",
"severity":"LOW or MEDIUM or HIGH or CRITICAL",
"confidence": number between 0-100,
"finding":"clear business explanation",
"citation":"exact clause or Not found",
"recommendation":"how to fix problem"
}}
"""

            response = llm_service.generate(prompt)

            clean = response.replace("```json","").replace("```","").strip()
            result = json.loads(clean)
            result["confidence"] = int(result.get("confidence", 70))

            # Apply Confidence Threshold logic
            threshold = settings.confidence_threshold if settings else 70
            if result.get("status") == "FAIL" and result["confidence"] < threshold:
                result["status"] = "WARN"
                result["finding"] = f"[Downgraded to WARN: AI Confidence {result['confidence']}% is below Strictness Threshold {threshold}%] " + result.get("finding", "")
                
            # Apply export visibility flags
            if settings:
                if not settings.include_recommendations:
                    result["recommendation"] = "Omitted per user settings."
                if not settings.include_citations:
                    result["citation"] = "Omitted per user settings."

            return result


        except Exception as e:

            logger.error(
                f"Rule check failed {rule['name']} : {str(e)}"
            )

            return {

                "status":"WARN",

                "severity":"MEDIUM",

                "confidence":60,

                "finding":"AI parsing failed",

                "citation":"Not found",

                "recommendation":"Manual review required"

            }



    def risk_score(self, results):

        score = 0

        for r in results:

            if r["status"]=="FAIL":

                if r["severity"]=="CRITICAL":

                    score += 25

                elif r["severity"]=="HIGH":

                    score += 15

                elif r["severity"]=="MEDIUM":

                    score += 8

                else:

                    score += 3


            elif r["status"]=="WARN":

                score += 5


        return min(score,100)



    def run_audit(self, document_id: str, rule_ids: list, db, settings=None):
        from app.models.rule import Rule
        logger.info(f"Starting audit {document_id} with rule_ids={rule_ids}")
        results = []

        if rule_ids:
            rules_to_run = db.query(Rule).filter(Rule.id.in_(rule_ids)).all()
        else:
            # If no specific rules selected, run default templates filtered by toggles
            templates = db.query(Rule).filter(Rule.is_template == True).all()
            if settings and settings.rule_toggles:
                rules_to_run = []
                toggles = settings.rule_toggles
                for rule in templates:
                    name_lower = rule.name.lower()
                    cat_lower = rule.category.lower()
                    
                    if "payment" in name_lower or "payment" in cat_lower:
                        if toggles.get("payment"): rules_to_run.append(rule)
                    elif "liability" in name_lower or "liability" in cat_lower:
                        if toggles.get("liability"): rules_to_run.append(rule)
                    elif "ip " in name_lower or "ip" in cat_lower or "intellectual" in name_lower:
                        if toggles.get("ip"): rules_to_run.append(rule)
                    elif "termination" in name_lower or "termination" in cat_lower:
                        if toggles.get("termination"): rules_to_run.append(rule)
                    elif "nda" in name_lower or "confidential" in name_lower or "nda" in cat_lower:
                        if toggles.get("nda"): rules_to_run.append(rule)
                    else:
                        rules_to_run.append(rule)
            else:
                rules_to_run = templates

        for rule in rules_to_run:
            # check_rule expects a typical dictionary struct
            rule_dict = {
                "id": rule.id,
                "name": rule.name,
                "description": rule.description
            }
            result = self.check_rule(document_id, rule_dict, settings)

            results.append({
                "rule_id": rule.id,
                "rule_name": rule.name,
                "status": result.get("status"),
                "severity": result.get("severity", rule.severity),
                "confidence": result.get("confidence"),
                "finding": result.get("finding"),
                "citation": result.get("citation"),
                "recommendation": result.get("recommendation")
            })


        score=self.risk_score(results)


        audit_result={

            "document":document_id,

            "risk_score":score,

            "rules_checked":len(results),

            "results":results

        }


        logger.info(f"Audit finished {document_id}")
        return audit_result



audit_service=AuditService()