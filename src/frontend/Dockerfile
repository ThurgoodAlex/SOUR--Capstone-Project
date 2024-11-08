# Use an official Node runtime as the base image
FROM ubuntu:20.04


ENV DEBIAN_FRONTEND=noninteractive
# Set the working directory in the container
WORKDIR /app

# Update and install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    vim \ 
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Explicitly set host to 0.0.0.0 to allow external connections
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Start expo with host set to 0.0.0.0
CMD ["/bin/bash"]
