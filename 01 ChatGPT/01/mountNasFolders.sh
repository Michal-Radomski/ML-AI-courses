#!/bin/bash

#* Not checked!, author: GPT-3.5 ;)

CONFIG_FILE="nas_config.txt"

# Check if the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "Error: Config file not found: $CONFIG_FILE"
  exit 1
fi

# Function to check if a destination is reachable
isDestinationReachable() {
  ping -c 1 -W 1 "$1" >/dev/null 2>&1
}

# Function to mount a source to a destination
mountSourceToDestination() {
  echo "Mounting $1 to $2"
  #* Add your mount command here
  # Example: mount -t cifs -o username=user,password=pass "//${1}" "${2}"
}

# Function to unmount a destination
unmountDestination() {
  echo "Unmounting $1"
  #* Add your unmount command here
  # Example: umount "${1}"
}

# Loop through each line in the config file
while IFS= read -r line; do
  source_path=$(echo "$line" | awk '{print $1}')
  destination_path=$(echo "$line" | awk '{print $2}')

  # Check if destination is reachable
  if isDestinationReachable "$destination_path"; then
    # Check if destination is mounted
    if mount | grep -q "$destination_path"; then
      echo "$destination_path is reachable and already mounted. Doing nothing."
    else
      # Mount the destination
      mountSourceToDestination "$source_path" "$destination_path"
    fi
  else
    # Check if destination is mounted
    if mount | grep -q "$destination_path"; then
      # Unmount the destination
      unmountDestination "$destination_path"
    else
      echo "$destination_path is unreachable and already unmounted. Doing nothing."
    fi
  fi
done <"$CONFIG_FILE"
