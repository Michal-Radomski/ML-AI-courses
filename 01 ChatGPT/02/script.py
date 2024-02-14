import os
import openai
from dotenv import load_dotenv

load_dotenv()  # Take environment variables from .env file

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
# print("OPENAI_API_KEY:", OPENAI_API_KEY)

chat_messages = []

while True:

  user_message = input("You (your input): ")

  chat_messages.append([{"role": "user", "content": user_message}])

  completion = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": user_message}, {"role": "system", "content": "You are history expert"}],
    # messages=chat_messages,
    temperature=0.2,
    max_tokens=1000
  )

  ai_response = completion.choices[0].message.content

  chat_messages.append({"role": "assistant", "content":  ai_response})

  print(ai_response,"\n", completion.usage, "\n",completion.model)
  # print("chat_messages:", chat_messages)
