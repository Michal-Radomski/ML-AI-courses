#!/bin/bash

# Run command: ./gitPush.sh "name of the commit"
# Author: GPT-3.5 ;)

gitPush() {
  commit_name="$1"

  # Check if commit name is provided
  if [ -z "$commit_name" ]; then
    echo "Error: Please provide a commit name."
    exit 1
  fi

  # Perform git commands
  git add -A
  git commit -m "$commit_name"
  git push
  git status

  # Wait for 5 seconds and clear the console
  sleep 5
  clear

  echo "Git commands executed successfully."
}

# Check if argument is provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 \"commit_name\""
  exit 1
fi

# Call the function with the provided argument
gitPush "$1"
