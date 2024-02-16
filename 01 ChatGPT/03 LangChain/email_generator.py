import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()  # Take environment variables from .env file

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
# print("OPENAI_API_KEY:", OPENAI_API_KEY)

llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, temperature=0.0)

resp = llm.invoke("How can langsmith help with testing?")
print("resp:", resp)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are world class technical documentation writer."),
    ("user", "{input}")
])

chain = prompt | llm 
resp2 = chain.invoke({"input": "how can langsmith help with testing?"})

print("resp2:", resp2)
