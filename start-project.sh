#!/bin/sh

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

# Set environment variable and start frontend
echo "Setting REACT_NATIVE_PACKAGER_HOSTNAME to $HOST_IP"
export REACT_NATIVE_PACKAGER_HOSTNAME=$HOST_IP

cd /app/src/frontend
echo "Starting frontend..."
echo "EXPO_PUBLIC_HOST=$HOST_IP" > .env

# Keep the script running to maintain the background process
start-frontend
wait $BACKEND_PID