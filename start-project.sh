#!/bin/bash

# Deploy infrastructure and wait for it to complete
echo "Deploying infrastructure..."
deploy-infra
echo "Infrastructure deployment completed!"

echo "Seeding database" 
cd src/backend/seeder 
echo "yes" | python3 db_seeder.py assets/default_config.json

# Start backend in background
echo "Starting backend..."
start-backend > /dev/null 2>&1 &
BACKEND_PID=$!


# Get IP address from user
echo -e "\nPlease enter your host computer's IP address:"
read HOST_IP

# Validate IP address (basic validation)
while ! [[ $HOST_IP =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; do
  echo "Invalid IP format. Please enter a valid IP address (e.g., 192.168.1.100):"
  read HOST_IP
done

# Set environment variable and start frontend
echo "Setting REACT_NATIVE_PACKAGER_HOSTNAME to $HOST_IP"
export REACT_NATIVE_PACKAGER_HOSTNAME=$HOST_IP

echo "Starting frontend..."
start-frontend

# Keep the script running to maintain the background process
wait $BACKEND_PID