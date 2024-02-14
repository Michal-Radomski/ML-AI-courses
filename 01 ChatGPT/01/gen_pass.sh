#!/bin/bash

# Author: GPT-3.5 ;)

gen_pass() {
  if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <password_length>"
    exit 1
  fi

  password_length=$1

  if [ "$password_length" -lt 12 ]; then
    echo "Error: Password length must be at least 12 characters."
    exit 1
  fi

  # Define character sets
  lowercase="abcdefghijklmnopqrstuvwxyz"
  uppercase="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  digits="0123456789"
  special_chars='!@#$%^&*()_-+=<>?'

  # Ensure at least one character from each set
  password="${lowercase:RANDOM%${#lowercase}:1}"
  password+="${uppercase:RANDOM%${#uppercase}:1}"
  password+="${digits:RANDOM%${#digits}:1}"
  password+="${special_chars:RANDOM%${#special_chars}:1}"

  # Generate the remaining part of the password
  remaining_length=$((password_length - 4))

  for i in $(seq "$remaining_length"); do
    all_chars="${lowercase}${uppercase}${digits}${special_chars}"
    password+="${all_chars:RANDOM%${#all_chars}:1}"
  done

  # Shuffle the password characters
  shuffled_password=$(echo "$password" | fold -w1 | shuf | tr -d '\n')

  echo "$shuffled_password"
}

# Check if an argument is provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <password_length>"
  exit 1
fi

# Call the function with the provided argument
gen_pass "$1"
