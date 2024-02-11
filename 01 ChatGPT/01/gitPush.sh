#!/bin/bash

# Run command: ./gitPush.sh "name of the commit" (bash "commit  name")
# Author: GPT-3.5 ;)

gitPush() {
  commit_name="$1"

  # Check if commit name is provided
  if [ -z "$commit_name" ]; then
    echo -e "\e[31mError: Please provide a commit name.\e[0m"
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

  echo -e "\e[32mGit commands executed successfully.\e[0m"
}

# Check if argument is provided
if [ "$#" -ne 1 ]; then
  echo -e "\e[31mUsage: $0 \"commit_name\"\e[0m"
  exit 1
fi

# Call the function with the provided argument
gitPush "$1"
