from groq import Groq
from app.core.config import GROQ_API_KEY, LLM_MODEL
from app.core.logger import logger
import time


class LLMService:

    def __init__(self):

        self.client = Groq(

            api_key=GROQ_API_KEY

        )

        self.model = LLM_MODEL


    def generate(

        self,

        prompt: str,

        retries=2

    ):

        for attempt in range(

            retries+1

        ):

            try:

                response = self.client.chat.completions.create(

                    model=self.model,

                    messages=[

                        {

                            "role": "user",

                            "content": prompt

                        }

                    ],

                    temperature=0

                )

                return response.choices[0].message.content


            except Exception as e:

                logger.error(

                    f"LLM failure attempt {attempt} : {str(e)}"

                )

                if attempt==retries:

                    raise e

                time.sleep(2)


llm_service=LLMService()