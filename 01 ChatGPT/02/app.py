import os
import openai
from dotenv import load_dotenv

load_dotenv()  # Take environment variables from .env file

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
# print("OPENAI_API_KEY:", OPENAI_API_KEY)

user_input = input("Add your prompt: ")

completion = openai.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[{"role": "user", "content": user_input}],
  temperature=0.2,
  max_tokens=1000
)

print(completion.choices[0].message.content, completion.usage, completion.model)
