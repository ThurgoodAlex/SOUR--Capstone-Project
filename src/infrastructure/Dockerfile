# Use Ubuntu as the base image
FROM ubuntu:20.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set the working directory
WORKDIR /app/infrastructure

# Update and install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    python3 \
    python3-pip \
    vim \ 
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install AWS CLI and LocalStack
RUN pip3 install awscli awscli-local

## Copy package.json from infrastructure directory
COPY package*.json ./

COPY . .

# Setup AWS configuration
RUN mkdir -p /root/.aws
COPY .aws/* /root/.aws/


RUN chmod +x deploy.sh 

# Compile TypeScript to JavaScript
ENTRYPOINT [ "/app/infrastructure/deploy.sh" ]

