from app.services.llm_service import llm_service
from app.services.retrieval_service import retrieval_service
from app.core.rulebook import RULES
from app.services.document_registry import document_registry
from app.core.logger import logger
import json


class AuditService:

    def check_rule(
        self,
        document_id: str,
        rule: dict
    ):

        logger.info(
            f"Checking rule '{rule['name']}' for document {document_id}"
        )

        try:

            context = "\n\n".join(

                retrieval_service.retrieve(

                    document_id,

                    rule["name"] + " " + rule["description"]

                )

            )

        except Exception as e:

            logger.error(
                f"Retrieval failed for {document_id}: {str(e)}"
            )

            return {

                "status": "WARN",

                "severity": "MEDIUM",

                "confidence": 50,

                "finding": "Document retrieval failed",

                "citation": "Not found",

                "recommendation": "Retry ingestion"

            }

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

        try:

            response = llm_service.generate(prompt)

            clean = response.replace(
                "```json", ""
            ).replace(
                "```", ""
            ).strip()

            parsed = json.loads(clean)

            logger.info(
                f"Rule checked successfully: {rule['name']}"
            )

            return parsed

        except Exception as e:

            logger.error(
                f"AI parsing failed for rule {rule['name']} : {str(e)}"
            )

            return {

                "status": "WARN",

                "severity": "MEDIUM",

                "confidence": 60,

                "finding": "AI response parsing failed",

                "citation": "Not found",

                "recommendation": "Manual review required"

            }


    def risk_score(self, results):

        score = 0

        for r in results:

            if r["status"] == "FAIL":

                if r["severity"] == "CRITICAL":

                    score += 25

                elif r["severity"] == "HIGH":

                    score += 15

                elif r["severity"] == "MEDIUM":

                    score += 8

                else:

                    score += 3

            elif r["status"] == "WARN":

                score += 5

        return min(score, 100)


    def run_audit(self, document_id: str):

        logger.info(
            f"Starting audit for document {document_id}"
        )

        results = []

        for rule in RULES:

            result = self.check_rule(

                document_id,

                rule

            )

            results.append({

                "rule_id": rule["id"],

                "rule_name": rule["name"],

                "status": result.get("status"),

                "severity": result.get("severity"),

                "confidence": result.get("confidence"),

                "finding": result.get("finding"),

                "citation": result.get("citation"),

                "recommendation": result.get("recommendation")

            })

        score = self.risk_score(results)

        document_registry.mark_audited(document_id)

        logger.info(
            f"Audit completed for {document_id} | Risk Score: {score}"
        )

        return {

            "document": document_id,

            "risk_score": score,

            "rules_checked": len(results),

            "results": results

        }


audit_service = AuditService()