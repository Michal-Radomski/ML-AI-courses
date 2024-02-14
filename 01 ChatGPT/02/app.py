import os
import openai
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env file

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
# print("OPENAI_API_KEY:", OPENAI_API_KEY)

completion = openai.chat.completions.create(
  model="gpt-3.5-turbo",
  messages=[{"role": "user", "content": "Hello!"}]
)

print(completion.choices[0].message)
