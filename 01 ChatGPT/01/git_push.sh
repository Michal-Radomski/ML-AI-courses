#!/bin/bash

# Run command: ./git_push.sh "name of the commit" (bash git_push.sh "commit name")
# Author: GPT-3.5 ;)

git_push() {
  commit_name="$1"

  # Check if commit name is provided
  if [ -z "$commit_name" ]; then
    # echo -e "\e[31mError: Please provide a commit name.\e[0m"
    echo -e "\e[1;31mError: Please provide a commit name.\e[0m" #* Bold added
    exit 1
  fi

  # Perform git commands
  git add -A
  git commit -m "$commit_name"
  git push
  # git status
  local var_git_status=$(git status | grep clean)

  # Wait for 5 seconds and clear the console
  sleep 5
  clear

  # echo -e "\e[32mGit commands executed successfully.\e[0m"
  echo -e "\e[1;32mGit commands executed successfully.\e[0m" #* Bold added
  echo -e "\e[1;44mGit status: $var_git_status\e[0m"
}

# Check if argument is provided
if [ "$#" -ne 1 ]; then
  # echo -e "\e[31mUsage: $0 \"commit_name\"\e[0m"
  echo -e "\e[1;31mUsage: $0 \"commit_name\"\e[0m" #* Bold added
  exit 1
fi

# Call the function with the provided argument
git_push "$1"
