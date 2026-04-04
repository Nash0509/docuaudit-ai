from pydantic import BaseModel

class RuleResult(BaseModel):

    rule_id:str

    rule_name:str

    status:str

    severity:str

    confidence:int

    finding:str

    citation:str

    recommendation:str


class AuditResponse(BaseModel):

    document:str

    risk_score:int

    rules_checked:int

    results:list