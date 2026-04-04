from app.services.llm_service import llm_service
from app.services.retrieval_service import retrieval_service
from app.core.rulebook import RULES
from app.core.logger import logger
import json


class AuditService:


    def check_rule(self, document_id: str, rule: dict):

        try:

            logger.info(
                f"Checking rule {rule['name']} for {document_id}"
            )

            context = "\n\n".join(

                retrieval_service.retrieve(

                    document_id,

                    rule["name"] + " " + rule["description"]

                )

            )


            prompt = f"""
You are a senior contract compliance auditor.

Analyze whether contract satisfies rule.

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

            clean = response.replace(
                "```json",""
            ).replace(
                "```",""
            ).strip()

            result = json.loads(clean)

            result["confidence"] = int(
                result.get("confidence",70)
            )

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



    def run_audit(self, document_id: str, rule_ids: list, db):
        from app.models.rule import Rule
        logger.info(f"Starting audit {document_id} with rule_ids={rule_ids}")
        results=[]

        if rule_ids:
            rules_to_run = db.query(Rule).filter(Rule.id.in_(rule_ids)).all()
        else:
            # If no specific rules selected, maybe run default templates
            rules_to_run = db.query(Rule).filter(Rule.is_template == True).all()

        for rule in rules_to_run:
            # check_rule expects a typical dictionary struct
            rule_dict = {
                "id": rule.id,
                "name": rule.name,
                "description": rule.description
            }
            result = self.check_rule(document_id, rule_dict)

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