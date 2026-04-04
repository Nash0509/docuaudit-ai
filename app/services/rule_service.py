import json

class RuleService:

    def get_default_rules(self):

        with open("rules/default.json") as f:

            return json.load(f)


    def get_industry_rules(self,industry):

        with open("rules/industry.json") as f:

            data=json.load(f)

        return data.get(industry,[])


    def get_user_rules(self,user_id):

        return []


    def get_rules(self,industry=None):

        rules=[]

        rules.extend(self.get_default_rules())

        if industry:

            rules.extend(

                self.get_industry_rules(industry)

            )

        return rules


rule_service = RuleService()