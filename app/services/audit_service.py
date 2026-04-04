from app.services.llm_service import llm_service
from app.services.retrieval_service import retrieval_service
from app.core.rulebook import RULES
from app.services.document_registry import document_registry
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



    def run_audit(self, document_id: str):

        logger.info(
            f"Starting audit {document_id}"
        )


        existing = document_registry.get_audit_result(
            document_id
        )

        if existing:

            logger.info(
                f"Audit already exists {document_id}"
            )

            return existing


        results=[]


        for rule in RULES:

            result=self.check_rule(

                document_id,

                rule

            )


            results.append({

                "rule_id":rule["id"],

                "rule_name":rule["name"],

                "status":result.get("status"),

                "severity":result.get("severity"),

                "confidence":result.get("confidence"),

                "finding":result.get("finding"),

                "citation":result.get("citation"),

                "recommendation":result.get("recommendation")

            })


        score=self.risk_score(results)


        audit_result={

            "document":document_id,

            "risk_score":score,

            "rules_checked":len(results),

            "results":results

        }


        document_registry.store_audit_result(

            document_id,

            audit_result

        )


        logger.info(
            f"Audit finished {document_id}"
        )


        return audit_result



audit_service=AuditService()